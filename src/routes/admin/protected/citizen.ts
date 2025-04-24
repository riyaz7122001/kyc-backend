import { DeleteCitizen, GetCitizenDetails, GetCitizensList, CreateCitizen, EditCitizen, ChangeCitizenActivation, UploadDocs } from "@controllers/admin/citizen";
import { ValidateCitizenId, ValidateCreateCitizen, ValidateEditCitizen } from "@middleware/citizen";
import { CreateCitizenValidationRules, EditCitizenValidationRules } from "@middleware/citizen/validator";
import { IdValidationRules, PaginationValidationRules, ValidateReqParams } from "@middleware/common/validator";
import { Router } from "express";

const router = Router();

router.get("/list", PaginationValidationRules(), ValidateReqParams, GetCitizensList);
router.get("/details/:id", IdValidationRules(), ValidateReqParams, ValidateCitizenId, GetCitizenDetails);
router.post("/create", CreateCitizenValidationRules(), ValidateReqParams, ValidateCreateCitizen, CreateCitizen);
router.put("/edit/:id", EditCitizenValidationRules(), ValidateReqParams, ValidateCitizenId, ValidateEditCitizen, EditCitizen);
router.delete("/delete/:id", IdValidationRules(), ValidateReqParams, ValidateCitizenId, DeleteCitizen);
router.put("/activation/:id", IdValidationRules(), ValidateReqParams, ValidateCitizenId, ChangeCitizenActivation);
router.post("/upload", UploadDocs);

export default router;