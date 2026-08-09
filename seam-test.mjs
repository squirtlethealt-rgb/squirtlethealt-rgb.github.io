// Regression test for the shoulder/arm skin-blend tearing issue.
//
// This does NOT render anything or need a browser/camera -- it reconstructs
// the real bind-pose bone chain (Spine2 -> LeftShoulder -> LeftArm ->
// LeftForeArm) using the ACTUAL local translation/rotation values read
// straight out of Advanced_Crew_Escape_Suit.glb, then runs the exact same
// poseShoulder()/pointBoneTo() math the live HTML file uses, across a full
// sweep of arm-raise angles. It measures the thing that actually causes
// visible tearing: how far each bone's LOCAL rotation strays from its own
// bind pose (identity, by this rig's "+Y points at child" convention) --
// a big per-bone delta at a seam where skin weights are shared between two
// bones is what pulls the mesh apart.
//
// Run with different SHOULDER_FOLLOW_FACTOR / MAX_SHOULDER_SWING_DEG
// values (passed as CLI args) to compare settings numerically instead of
// eyeballing screenshots.

import * as THREE from 'three';

const [,, factorArg, capDegArg] = process.argv;
const SHOULDER_FOLLOW_FACTOR = factorArg ? parseFloat(factorArg) : 0.4;
const MAX_SHOULDER_SWING_DEG = capDegArg ? parseFloat(capDegArg) : 40;
const MAX_SHOULDER_SWING_RAD = THREE.MathUtils.degToRad(MAX_SHOULDER_SWING_DEG);

// Real bind-pose local transforms, read directly from the GLB.
const BIND = {
  Spine2:       { t:[-3.390393885638332e-07,14.111745834350586,-9.374318210575439e-08], r:[-1.257285386913054e-08,5.3273357947247746e-15,1.0686963873530672e-15,1.0] },
  LeftShoulder: { t:[7.188236713409424,12.437228202819824,0.7087819576263428],          r:[0.626185417175293,0.359359472990036,-0.5684528350830078,0.394479364156723] },
  LeftArm:      { t:[-4.76837158203125e-07,16.50749397277832,1.3850629329681396e-05],   r:[0.24199479818344116,0.32852715253829956,-0.08748331665992737,0.9087656736373901] },
  LeftForeArm:  { t:[-3.337860107421875e-06,15.709074020385742,1.9073486328125e-06],    r:[-0.054026223719120026,-0.08404933661222458,0.538008987903595,0.8369965553283691] },
};

function makeBone(name, parent){
  const b = new THREE.Bone();
  b.name = name;
  b.position.fromArray(BIND[name].t);
  b.quaternion.fromArray(BIND[name].r);
  if(parent) parent.add(b);
  return b;
}

const spine2 = makeBone('Spine2', null);
const shoulder = makeBone('LeftShoulder', spine2);
const arm = makeBone('LeftArm', shoulder);
const foreArm = makeBone('LeftForeArm', arm);
spine2.updateMatrixWorld(true);

// --- exact same helper functions as index.html ---
const _tmpQ = new THREE.Quaternion();
const RESTY = new THREE.Vector3(0,1,0);

function computeSwingTwist(bindLocalQuat){
  const bindDir = new THREE.Vector3(0,1,0).applyQuaternion(bindLocalQuat).normalize();
  const swing = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), bindDir);
  const twist = swing.clone().invert().multiply(bindLocalQuat);
  return twist;
}

function pointBoneTo(bone, targetWorldDir, twistQuat){
  bone.parent.updateWorldMatrix(true, false);
  bone.parent.getWorldQuaternion(_tmpQ);
  _tmpQ.invert();
  const localDir = targetWorldDir.clone().applyQuaternion(_tmpQ);
  if(localDir.lengthSq() < 1e-8) return;
  localDir.normalize();
  const swing = new THREE.Quaternion().setFromUnitVectors(RESTY, localDir);
  // Recompose with the bone's ORIGINAL bind-pose twist instead of
  // discarding it -- setFromUnitVectors alone always returns the
  // shortest-arc rotation with zero twist around the target axis, which
  // silently erases any roll the rig's bind pose actually had.
  bone.quaternion.copy(twistQuat ? swing.clone().multiply(twistQuat) : swing);
  bone.updateWorldMatrix(true, false);
}

function poseShoulder(bone, armRestWorldDir, liveDir, shoulderBindLocalQuat){
  // How far the ARM has swung from ITS OWN rest direction -- a physically
  // meaningful quantity -- as opposed to comparing against the shoulder
  // bone's own bind axis (which points along the tiny clavicle segment,
  // an unrelated direction, and was the actual bug: it made the shoulder
  // rotate a huge amount even when the tracked arm hadn't moved at all).
  const swingQuat = new THREE.Quaternion().setFromUnitVectors(armRestWorldDir, liveDir);
  const swingAngle = 2 * Math.acos(THREE.MathUtils.clamp(Math.abs(swingQuat.w), -1, 1));
  if(swingAngle < 1e-4) return;

  const desiredAngle = Math.min(swingAngle * SHOULDER_FOLLOW_FACTOR, MAX_SHOULDER_SWING_RAD);
  const t = desiredAngle / swingAngle;
  const identity = new THREE.Quaternion();
  const partialSwing = identity.clone().slerp(swingQuat, t);

  // Apply that partial swing as an ADDITIONAL world-space rotation on top
  // of the shoulder's own bind pose -- not re-aiming its local axis.
  bone.parent.updateWorldMatrix(true, false);
  const parentWorldQuat = new THREE.Quaternion();
  bone.parent.getWorldQuaternion(parentWorldQuat);
  const bindWorldQuat = parentWorldQuat.clone().multiply(shoulderBindLocalQuat);
  const newWorldQuat = partialSwing.clone().multiply(bindWorldQuat);
  const invParent = parentWorldQuat.clone().invert();
  bone.quaternion.copy(invParent.multiply(newWorldQuat));
  bone.updateWorldMatrix(true, false);
}

function localDeltaFromBindDeg(bone, bindLocalQuat){
  // Angle between the bone's CURRENT local quaternion and its ACTUAL bind
  // local quaternion (not identity -- this rig's bones have real non-
  // identity bind rotations baked in, e.g. LeftShoulder's bind quaternion
  // has w=0.394, which is a ~133 degree angle from identity all by itself.
  // Measuring "delta from identity" would just report that constant bind
  // offset forever, regardless of live pose -- measuring delta from the
  // bind quaternion itself is what actually reflects live deviation.
  const deltaQuat = bindLocalQuat.clone().invert().multiply(bone.quaternion.clone());
  const w = THREE.MathUtils.clamp(Math.abs(deltaQuat.w), -1, 1);
  return THREE.MathUtils.radToDeg(2 * Math.acos(w));
}

// Bind-pose world direction of LeftArm's local +Y (i.e. the true rest
// shoulder->elbow direction), used as the axis to rotate away from for
// the synthetic sweep.
const armRestWorldQuat = new THREE.Quaternion();
arm.getWorldQuaternion(armRestWorldQuat);
const restShoulderToElbow = new THREE.Vector3(0,1,0).applyQuaternion(armRestWorldQuat).normalize();

// Pick a swing axis roughly perpendicular to the rest arm direction
// (simulates raising the arm out to the side / forward).
const swingAxis = new THREE.Vector3(1,0,0.3).normalize();

const shoulderBindLocalQuat = shoulder.quaternion.clone();
const armBindLocalQuat = arm.quaternion.clone();
const armTwist = computeSwingTwist(armBindLocalQuat);

console.log(`SHOULDER_FOLLOW_FACTOR=${SHOULDER_FOLLOW_FACTOR}  MAX_SHOULDER_SWING_DEG=${MAX_SHOULDER_SWING_DEG}`);
console.log('theta(raise) | shoulderDelta(seam:chest) | armDelta(seam:elbow-side) | worseSeam | tear risk');
console.log('-------------|---------------------------|---------------------------|-----------|----------');

const TEAR_RISK_THRESHOLD_DEG = 40; // calibrated against observed screenshots

let worstInNormalRange = 0; // 0-90 degrees = "arms at sides through shoulder height"
let anyFail = false;

for(let theta = 0; theta <= 180; theta += 15){
  // reset bones to bind before each sample
  shoulder.quaternion.fromArray(BIND.LeftShoulder.r);
  arm.quaternion.fromArray(BIND.LeftArm.r);
  spine2.updateMatrixWorld(true);

  const q = new THREE.Quaternion().setFromAxisAngle(swingAxis, THREE.MathUtils.degToRad(theta));
  const liveDir = restShoulderToElbow.clone().applyQuaternion(q).normalize();

  poseShoulder(shoulder, restShoulderToElbow, liveDir, shoulderBindLocalQuat);
  pointBoneTo(arm, liveDir, armTwist);

  const shoulderDelta = localDeltaFromBindDeg(shoulder, shoulderBindLocalQuat);
  const armDelta = localDeltaFromBindDeg(arm, armBindLocalQuat);
  const worse = Math.max(shoulderDelta, armDelta);
  const risk = worse > TEAR_RISK_THRESHOLD_DEG ? 'LIKELY TEAR' : 'ok';
  if(risk === 'LIKELY TEAR') anyFail = anyFail || (theta <= 90);
  if(theta <= 90) worstInNormalRange = Math.max(worstInNormalRange, worse);

  console.log(
    String(theta).padStart(12) + ' | ' +
    shoulderDelta.toFixed(1).padStart(25) + ' | ' +
    armDelta.toFixed(1).padStart(25) + ' | ' +
    worse.toFixed(1).padStart(9) + ' | ' + risk
  );
}

console.log('');
console.log(`Worst-case mismatch within normal range (0-90 deg raise): ${worstInNormalRange.toFixed(1)} deg`);
console.log(anyFail
  ? 'RESULT: FAIL -- tearing risk detected within the normal pose range.'
  : 'RESULT: PASS -- normal pose range stays under the tear-risk threshold.');
