/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

export interface ParkingParams {
  parkName: string;
  address: string;
  longitude: string;
  latitude: string;
  lotTotal: number;
  isWash: number;
  isAuto: number;
  isChargingPile: number;
  isGroundLock: number;
  ip: string;
  port: string;
  username: string;
  password: string;
  topic: string;
  id?: string;
}

export interface CardPort {
  lotNo: string;
  lotType: string;
  region: string;
  floor: string;
  available: number;
  id?: string;
}
/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  code: string;
  access_token: string;
  message: string;
  msgNo: string;
  success: boolean;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}
