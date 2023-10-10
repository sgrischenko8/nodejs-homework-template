const { Router } = require("express");

const { userController } = require("../../controllers");
const { userMiddleware } = require("../../middlewares");

const router = Router();

router
  .route("/register")
  .post(
    userMiddleware.checkUserData,
    userMiddleware.checkIsEmailAlreadyUsed,
    userController.register
  );
router
  .route("/login")
  .post(
    userMiddleware.checkUserData,
    userMiddleware.IsEmailAndPasswordFit,
    userController.login
  );
router
  .route("/current")
  .get(userMiddleware.checkToken, userController.getCurrentUser);
router.route("/logout").post(userMiddleware.checkToken, userController.logout);
router
  .route("/")
  .patch(
    userMiddleware.checkToken,
    userMiddleware.throwPatchSubscriptionError,
    userController.changeSubscription
  );
router
  .route("/avatars")
  .patch(
    userMiddleware.checkToken,
    userMiddleware.uploadUserAvatar,
    userMiddleware.checkAbsenceFile,
    userMiddleware.resizeUserAvatar,
    userController.updateAvatar
  );

module.exports = router;
