CREATE TABLE IF NOT EXISTS app_users(
  id BIGSERIAL PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,role TEXT NOT NULL,password_hash TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS workflow_cases(
  id BIGSERIAL PRIMARY KEY,workflow_id TEXT NOT NULL,reference TEXT UNIQUE NOT NULL,subject TEXT NOT NULL,owner TEXT NOT NULL,state TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,payload JSONB NOT NULL DEFAULT '{}'::jsonb,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS audit_events(
  id BIGSERIAL PRIMARY KEY,event_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),actor TEXT NOT NULL,action TEXT NOT NULL,object_type TEXT NOT NULL,object_reference TEXT NOT NULL,detail TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS saved_analyses(
  id BIGSERIAL PRIMARY KEY,workflow_id TEXT NOT NULL,actor TEXT NOT NULL,analysis_type TEXT NOT NULL,inputs JSONB NOT NULL,result JSONB NOT NULL,provider TEXT NOT NULL,model TEXT,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS integration_state(
  id TEXT PRIMARY KEY,name TEXT NOT NULL,category TEXT NOT NULL,mode TEXT NOT NULL,status TEXT NOT NULL,last_tested TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_workflow_cases_workflow ON workflow_cases(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_cases_due ON workflow_cases(due_date);
CREATE INDEX IF NOT EXISTS idx_audit_events_time ON audit_events(event_time DESC);

CREATE TABLE IF NOT EXISTS "op_mrf_ingestion"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_hospital" TEXT NOT NULL,
  "data_fileUrl" TEXT NOT NULL,
  "data_templateVersion" TEXT NOT NULL,
  "data_validationNotes" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_mrf_ingestion_due ON "op_mrf_ingestion"(due_date);

CREATE TABLE IF NOT EXISTS "op_allowed_amounts"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_payer" TEXT NOT NULL,
  "data_billingCode" TEXT NOT NULL,
  "data_medianAllowed" NUMERIC(16,2) NOT NULL,
  "data_observationCount" NUMERIC(16,2) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_allowed_amounts_due ON "op_allowed_amounts"(due_date);

CREATE TABLE IF NOT EXISTS "op_rate_completeness"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_payer" TEXT NOT NULL,
  "data_plan" TEXT NOT NULL,
  "data_expectedCodes" NUMERIC(16,2) NOT NULL,
  "data_publishedCodes" NUMERIC(16,2) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_rate_completeness_due ON "op_rate_completeness"(due_date);

CREATE TABLE IF NOT EXISTS "op_code_normalization"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_codeType" TEXT NOT NULL,
  "data_billingCode" TEXT NOT NULL,
  "data_description" TEXT NOT NULL,
  "data_serviceSetting" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_code_normalization_due ON "op_code_normalization"(due_date);

CREATE TABLE IF NOT EXISTS "op_attestation"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_official" TEXT NOT NULL,
  "data_reportingPeriod" TEXT NOT NULL,
  "data_exceptionCount" NUMERIC(16,2) NOT NULL,
  "data_attestationBasis" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_attestation_due ON "op_attestation"(due_date);

CREATE TABLE IF NOT EXISTS "op_accessibility"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_fileUrl" TEXT NOT NULL,
  "data_httpStatus" NUMERIC(16,2) NOT NULL,
  "data_downloadSeconds" NUMERIC(16,2) NOT NULL,
  "data_accessNotes" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_accessibility_due ON "op_accessibility"(due_date);

CREATE TABLE IF NOT EXISTS "op_enforcement"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_noticeId" TEXT NOT NULL,
  "data_noticeDate" DATE NOT NULL,
  "data_responseDue" DATE NOT NULL,
  "data_responsePlan" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_enforcement_due ON "op_enforcement"(due_date);

CREATE TABLE IF NOT EXISTS "op_benchmarking"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_market" TEXT NOT NULL,
  "data_billingCode" TEXT NOT NULL,
  "data_hospitalRate" NUMERIC(16,2) NOT NULL,
  "data_peerMedian" NUMERIC(16,2) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_benchmarking_due ON "op_benchmarking"(due_date);

CREATE TABLE IF NOT EXISTS "op_hospital_registry"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_hospital" TEXT NOT NULL,
  "data_ccn" TEXT NOT NULL,
  "data_location" TEXT NOT NULL,
  "data_official" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_hospital_registry_due ON "op_hospital_registry"(due_date);

CREATE TABLE IF NOT EXISTS "op_payer_plan_master"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_payer" TEXT NOT NULL,
  "data_plan" TEXT NOT NULL,
  "data_market" TEXT NOT NULL,
  "data_product" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_payer_plan_master_due ON "op_payer_plan_master"(due_date);

CREATE TABLE IF NOT EXISTS "op_billing_code_master"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_codeType" TEXT NOT NULL,
  "data_billingCode" TEXT NOT NULL,
  "data_description" TEXT NOT NULL,
  "data_serviceSetting" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_billing_code_master_due ON "op_billing_code_master"(due_date);

CREATE TABLE IF NOT EXISTS "op_cms_control_library"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_requirement" TEXT NOT NULL,
  "data_effectiveDate" DATE NOT NULL,
  "data_testProcedure" TEXT NOT NULL,
  "data_evidenceStandard" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_cms_control_library_due ON "op_cms_control_library"(due_date);
