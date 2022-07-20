import { defHttp } from '/@/utils/http/axios';
import { CardPort, LoginParams, LoginResultModel, ParkingParams } from './model/userModel';
import { ErrorMessageMode } from '/#/axios';
enum Api {
  Login = '/login',
  parkingList = '/avp/parking/list',
  parkingAdd = '/avp/parking/add',
  parkingEdit = '/avp/parking/update-by-id',
  carportList = '/avp/lot/page',
  carportEdit = '/avp/lot/update-by-id',
  carportDelete = '/avp/lot/delete-by-ids',
  carportAdd = '/avp/lot/add',
  deviceList = '/avp/device/page',
  deviceAdd = '/avp/device/add',
  deviceDelete = '/avp/device/delete-by-ids',
  deviceEdit = '/avp/device/update-by-id',
  userList = '/avp/user/page',
  userAdd = '/avp/user/add',
  userDelete = '/avp/user/delete-by-ids',
  userEdit = '/avp/user/update-by-id',
  vehicleList = '/avp/vehicle/page',
  vehicleAdd = '/avp/vehicle/add',
  vehicleDelete = '/avp/vehicle/delete-by-ids',
  vehicleEdit = '/avp/vehicle/update-by-id',
  deviceTypeList = '/avp/device-type/page',
  deviceTypeAdd = '/avp/device-type/add',
  deviceTypeDelete = '/avp/device-type/delete-by-ids',
  deviceTypeEdit = '/avp/device-type/update-by-id',
  clearCache = '/avp/parking/clear-cache',
  import = '/avp/lot/import', // 导入
  syncCloud = '/avp/lot/sync-cloud', // 同步
  password = '/avp/user/update/password', // 修改密码
  cameraList = '/avp/device/camera-info/page',
  cameraAdd = '/avp/device/camera-info/add',
  cameraEdit = '/avp/device/camera-info/update'
}
/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export const parkingApi = () => {
  return defHttp.post<any>({ url: Api.parkingList });
};

export const clearCacheApi = () => {
  return defHttp.get<any>({ url: Api.clearCache });
};
export const syncCloudApi = () => {
  return defHttp.get<any>({ url: Api.syncCloud });
};

export function changeStatusApi(url, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: url
    },
    {
      errorMessageMode: mode
    }
  );
}
export function importApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.import,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function addParkingApi(params: ParkingParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.parkingAdd,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function editParkingApi(params: ParkingParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.parkingEdit,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function stapParkingApi(params: ParkingParams, val: string) {
  return defHttp.post<any>({
    url: val,
    params
  });
}

export const carportList = (params: CardPort) => {
  return defHttp.post<any>({
    url: Api.carportList,
    params
  });
};

export function carportEditApi(params: CardPort, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.carportEdit,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}

export function carportDelete(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.carportDelete,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function carportAddApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.carportAdd,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}

export function deviceListApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.deviceList,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function deviceAddApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.deviceAdd,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function deviceDeleteApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.deviceDelete,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function deviceEditApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.deviceEdit,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function userListApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.userList,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function userAddApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.userAdd,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function userDeleteApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.userDelete,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function userEditApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.userEdit,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function userRestApi(params: any, val: string) {
  return defHttp.post<any>({
    url: val,
    params
  });
}
export function vehicleListApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.vehicleList,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function vehicleAddApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.vehicleAdd,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function vehicleDeleteApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.vehicleDelete,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function vehicleEditApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.vehicleEdit,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function deviceTypeListApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.deviceTypeList,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function deviceTypeAddApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.deviceTypeAdd,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function deviceTypeDeleteApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.deviceTypeDelete,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function deviceTypeEditApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.deviceTypeEdit,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function carPortRecordApi(url: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.get<any>(
    {
      url: url
    },
    {
      errorMessageMode: mode
    }
  );
}
export function passwordApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.password,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function cameraApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.cameraList,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function cameraAddApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.cameraAdd,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function cameraEditApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.cameraEdit,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
export function cameraDeleteApi(url: any, params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: url,
      params
    },
    {
      errorMessageMode: mode
    }
  );
}
