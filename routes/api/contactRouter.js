const { Router } = require("express");

const { contactController } = require("../../controllers");
const { contactMiddleware } = require("../../middlewares");

const router = Router();

router
  .route("/")
  .get(contactMiddleware.checkAbsenceBody, contactController.listContacts)
  .post(contactMiddleware.throwError, contactController.addContact);
router.use("/:id", contactMiddleware.checkContactId);
router
  .route("/:id")
  .get(contactMiddleware.checkAbsenceBody, contactController.getById)
  .put(
    contactMiddleware.checkAbsenceBodyInPut,
    contactMiddleware.throwError,
    contactController.updateContact
  )
  .delete(contactMiddleware.checkAbsenceBody, contactController.removeContact);

module.exports = router;
