/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const CLOUDINARY_ROOT = 'https://res.cloudinary.com/fcufbtuc/image/upload';

/** Facility building with forecourt (IMG_0109) */
export const facilityBuildingImage = `${CLOUDINARY_ROOT}/IMG_0109.jpg`;
/** Funeral procession outdoors (3A0A0268) */
export const processionImage = `${CLOUDINARY_ROOT}/3A0A0268.jpg`;
/** Ceremony interior with floral arrangements (3A0A0754) */
export const ceremonyImage = `${CLOUDINARY_ROOT}/3A0A0754.jpg`;
export const staffSklarbi = `${CLOUDINARY_ROOT}/S.K._LARBI-373.jpg`;
export const staffAtiaviGlime = `${CLOUDINARY_ROOT}/Atiavi_Glime-408.jpg`;
export const staffEmmanuelOdame = `${CLOUDINARY_ROOT}/EMMANUEL_ODAME_-160.jpg`;
export const staffHelen = `${CLOUDINARY_ROOT}/HELEN-91.jpg`;

/** Capability photography for the service capability cards (section 5). */
export const capabilityImages = {
  eventCoordination: `${CLOUDINARY_ROOT}/v1792658588/events_coordination.jpg`,
  logisticsTransport: `${CLOUDINARY_ROOT}/v1792658588/logistics_transport.jpg`,
  caskets: `${CLOUDINARY_ROOT}/v1792658589/caskets.jpg`,
  catering: `${CLOUDINARY_ROOT}/v1792658589/catering.jpg`,
  repatriation: `${CLOUDINARY_ROOT}/v1792658588/repatration.jpg`,
  cemeterySupport: `${CLOUDINARY_ROOT}/v1792658601/cemetary_support.jpg`,
  pallbearing: `${CLOUDINARY_ROOT}/v1792658588/pallbearing.jpg`
};

/**
 * Inserts Cloudinary transform parameters after /upload/ in a delivery URL.
 */
export function cloudinary(url: string, transforms: string): string {
  return url.replace('/upload/', `/upload/${transforms}/`);
}
