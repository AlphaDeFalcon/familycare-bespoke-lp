/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const CLOUDINARY_ROOT = 'https://res.cloudinary.com/fcufbtuc/image/upload';

export const heroImage = `${CLOUDINARY_ROOT}/IMG_0109.jpg`;
export const staffSklarbi = `${CLOUDINARY_ROOT}/S.K._LARBI-373.jpg`;
export const staffAtiaviGlime = `${CLOUDINARY_ROOT}/Atiavi_Glime-408.jpg`;
export const staffEmmanuelOdame = `${CLOUDINARY_ROOT}/EMMANUEL_ODAME_-160.jpg`;
export const staffHelen = `${CLOUDINARY_ROOT}/HELEN-91.jpg`;
export const facilityImage = `${CLOUDINARY_ROOT}/3A0A0268.jpg`;
export const ceremonyImage = `${CLOUDINARY_ROOT}/3A0A0754.jpg`;

/**
 * Inserts Cloudinary transform parameters after /upload/ in a delivery URL.
 */
export function cloudinary(url: string, transforms: string): string {
  return url.replace('/upload/', `/upload/${transforms}/`);
}
