import { DeleteCitizen, GetCitizenDetails, GetCitizensList, CreateCitizen, EditCitizen, ChangeCitizenActivation, AcceptKyc, RejectKyc, GetDashboardDetails } from "@controllers/admin/citizen";
import { ValidateCitizenId, ValidateCreateCitizen, ValidateEditCitizen, ValidateKyc } from "@middleware/citizen";
import { CreateCitizenValidationRules, EditCitizenValidationRules } from "@middleware/citizen/validator";
import { IdValidationRules, PaginationValidationRules, ValidateReqParams } from "@middleware/common/validator";
import { Router } from "express";

const router = Router();

router.get("/list", PaginationValidationRules(), ValidateReqParams, GetCitizensList);
router.get("/details/:id", IdValidationRules(), ValidateReqParams, ValidateCitizenId, GetCitizenDetails);
router.get("/dashboard", GetDashboardDetails);
router.post("/create", CreateCitizenValidationRules(), ValidateReqParams, ValidateCreateCitizen, CreateCitizen);
router.delete("/delete/:id", IdValidationRules(), ValidateReqParams, ValidateCitizenId, DeleteCitizen);
router.put("/edit/:id", EditCitizenValidationRules(), ValidateReqParams, ValidateCitizenId, ValidateEditCitizen, EditCitizen);
router.put("/activation/:id", IdValidationRules(), ValidateReqParams, ValidateCitizenId, ChangeCitizenActivation);
router.put("/accept/:id", IdValidationRules(), ValidateReqParams, ValidateCitizenId, AcceptKyc);
router.put("/reject/:id", IdValidationRules(), ValidateReqParams, ValidateCitizenId, ValidateKyc, RejectKyc);

export default router;