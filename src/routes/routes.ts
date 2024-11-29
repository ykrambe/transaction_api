//Auth
import * as login from './auth/login'
import * as logout from './auth/logout'

//Banner
import * as generateBanner from './banner/generateBanner'
import * as getBanners from './banner/getBanners'

//service
import * as generateService from './service/generateService'
import * as getServices from './service/getServices'

//transaction
import * as getBalance from './transaction/getBalance'
import * as history from './transaction/history'
import * as topUpBalance from './transaction/topUpBalance'
import * as tranaction from './transaction/transaction'

// user
import * as getprofile from './user/getprofile'
import * as getUsers from './user/getUsers'
import * as registration from './user/registration'
import * as updateProfile from './user/updateProfile'
import * as updateProfileImage from './user/updateProfileImage'



const applyRoute=(app:any):any=>{
  //auth
  app.use(login.default);
  app.use(logout.default);

  //auth
  app.use(generateBanner.default);
  app.use(getBanners.default);

  //service
  app.use(generateService.default);
  app.use(getServices.default)

  //transaction
  app.use(getBalance.default)
  app.use(history.default)
  app.use(topUpBalance.default)
  app.use(tranaction.default)

  //user
  app.use(getprofile.default)
  app.use(getUsers.default)
  app.use(registration.default)
  app.use(updateProfile.default)
  app.use(updateProfileImage.default)
}

export{applyRoute}