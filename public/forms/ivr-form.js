{
  `path`: `public/forms/ivr-form.js`,
  `repo`: `msc-wound-care-railway`,
  `owner`: `rvalen1123`,
  `branch`: `main`,
  `content`: `/**
 * Insurance Verification Request (IVR) Form Template
 * This file contains the form structure and sections for the IVR form
 */

/**
 * Generates the IVR form HTML structure
 * @returns {string} The complete HTML for the IVR form
 */
const createIVRForm = () => {
  // Define form steps and their content
  const patientInfoStep = createPatientInfoStep();
  const insuranceInfoStep = createInsuranceInfoStep();
  const providerInfoStep = createProviderInfoStep();
  const woundInfoStep = createWoundInfoStep();
  const reviewStep = createReviewStep();
  
  // Define step labels for the indicator
  const stepLabels = [
    'Patient Information',
    'Insurance Information',
    'Provider Details',
    'Wound Information',
    'Review & Submit'
  ];
  
  // Create step indicator
  const stepIndicator = FormComponents.createStepIndicator(1, 5, stepLabels);
  
  // Create form navigation
  const formNavigation = FormComponents.createFormNavigation({
    currentStep: 1,
    totalSteps: 5,
    prevLabel: 'Previous',
    nextLabel: 'Next',
    submitLabel: 'Submit Request'
  });
  
  // Combine all parts into the complete form
  return `
    <form id=\"ivrForm\" class=\"ivr-form\" action=\"/submit-ivr\" method=\"POST\">
      <div id=\"stepIndicator\" class=\"step-indicator-container\">
        ${stepIndicator}
      </div>
      
      <div class=\"form-steps\">
        <div id=\"step1\" class=\"form-step\">
          ${patientInfoStep}
        </div>
        
        <div id=\"step2\" class=\"form-step\">
          ${insuranceInfoStep}
        </div>
        
        <div id=\"step3\" class=\"form-step\">
          ${providerInfoStep}
        </div>
        
        <div id=\"step4\" class=\"form-step\">
          ${woundInfoStep}
        </div>
        
        <div id=\"step5\" class=\"form-step\">
          ${reviewStep}
        </div>
      </div>
      
      <div id=\"formNavigation\" class=\"form-navigation-container\">
        ${formNavigation}
      </div>
    </form>
  `;
};

/**
 * Creates the patient information step of the form
 * @returns {string} HTML for the patient info step
 */
const createPatientInfoStep = () => {
  // Create section header
  const sectionHeader = FormComponents.createFormSection(
    'Patient Information', 
    'Please provide the patient details for insurance verification'
  );
  
  // Create form fields
  const patientNameField = FormComponents.createTextInput({
    id: 'patientName',
    label: 'Patient Name',
    placeholder: 'Full name of the patient',
    required: true
  });
  
  const patientDobField = FormComponents.createDatePicker({
    id: 'patientDob',
    label: 'Date of Birth',
    required: true,
    helpText: 'MM/DD/YYYY format'
  });
  
  const patientAddressField = FormComponents.createTextInput({
    id: 'patientAddress',
    label: 'Patient Address',
    placeholder: 'Street address, City, State, ZIP',
    required: true
  });
  
  const patientPhoneField = FormComponents.createTextInput({
    id: 'patientPhone',
    label: 'Patient Phone Number',
    placeholder: '(XXX) XXX-XXXX',
    type: 'tel',
    required: true
  });
  
  const contactPermissionField = FormComponents.createRadioGroup({
    name: 'contactPermission',
    label: 'Permission to Contact Patient',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ],
    required: true
  });
  
  const nursingFacilityField = FormComponents.createRadioGroup({
    name: 'nursingFacility',
    label: 'Currently Residing in Skilled Nursing Facility',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ],
    required: true
  });
  
  const surgicalPeriodField = FormComponents.createRadioGroup({
    name: 'surgicalPeriod',
    label: 'Under Global Surgical Period',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ],
    required: true,
    helpText: 'Is patient within a post-surgical period covered by the procedure's global period?'
  });
  
  const surgicalInfoFields = `
    <div id=\"surgicalInfoContainer\" style=\"display: none;\">
      ${FormComponents.createTextInput({
        id: 'cptCode',
        label: 'CPT Code',
        placeholder: 'Enter CPT code',
        helpText: 'The CPT code for the surgery'
      })}
      
      ${FormComponents.createDatePicker({
        id: 'surgeryDate',
        label: 'Surgery Date',
        helpText: 'Date the surgery was performed'
      })}
    </div>
  `;
  
  // Combine all fields
  return `
    <div class=\"patient-info-container\">
      ${sectionHeader}
      <div class=\"form-section-content\">
        ${patientNameField}
        ${patientDobField}
        ${patientAddressField}
        ${patientPhoneField}
        ${contactPermissionField}
        ${nursingFacilityField}
        ${surgicalPeriodField}
        ${surgicalInfoFields}
      </div>
    </div>
  `;
};

/**
 * Creates the insurance information step of the form
 * @returns {string} HTML for the insurance info step
 */
const createInsuranceInfoStep = () => {
  // Create section header
  const sectionHeader = FormComponents.createFormSection(
    'Insurance Information', 
    'Provide primary and secondary (if applicable) insurance details'
  );
  
  // Primary insurance fields
  const primaryInsName = FormComponents.createTextInput({
    id: 'primaryInsName',
    label: 'Primary Insurance Name',
    placeholder: 'Name of insurance provider',
    required: true
  });
  
  const primaryInsPhone = FormComponents.createTextInput({
    id: 'primaryInsPhone',
    label: 'Primary Insurance Phone Number',
    placeholder: '(XXX) XXX-XXXX',
    type: 'tel',
    required: true
  });
  
  const primaryInsSubscriberName = FormComponents.createTextInput({
    id: 'primaryInsSubscriberName',
    label: 'Primary Insurance Subscriber Name',
    placeholder: 'Name of the policy holder',
    required: true
  });
  
  const primaryInsPolicyNumber = FormComponents.createTextInput({
    id: 'primaryInsPolicyNumber',
    label: 'Primary Insurance Policy Number',
    placeholder: 'Policy or ID number',
    required: true
  });
  
  const primaryInsSubscriberDob = FormComponents.createDatePicker({
    id: 'primaryInsSubscriberDob',
    label: 'Primary Insurance Subscriber DOB',
    required: true
  });
  
  const primaryInsPlanType = FormComponents.createSelect({
    id: 'primaryInsPlanType',
    label: 'Primary Insurance Plan Type',
    options: ['HMO', 'PPO', 'Medicare', 'Medicaid', 'Other'],
    required: true
  });
  
  const networkParticipation = FormComponents.createSelect({
    id: 'networkParticipation',
    label: 'Provider Network Participation Status',
    options: ['In-Network', 'Out-of-Network', 'Unknown'],
    required: true
  });
  
  // Secondary insurance fields (optional)
  const hasSecondaryIns = FormComponents.createRadioGroup({
    name: 'hasSecondaryIns',
    label: 'Does patient have secondary insurance?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ],
    required: true
  });
  
  const secondaryInsFields = `
    <div id=\"secondaryInsContainer\" style=\"display: none;\">
      ${FormComponents.createTextInput({
        id: 'secondaryInsName',
        label: 'Secondary Insurance Name',
        placeholder: 'Name of secondary insurance provider'
      })}
      
      ${FormComponents.createTextInput({
        id: 'secondaryInsPhone',
        label: 'Secondary Insurance Phone Number',
        placeholder: '(XXX) XXX-XXXX',
        type: 'tel'
      })}
      
      ${FormComponents.createTextInput({
        id: 'secondaryInsSubscriberName',
        label: 'Secondary Insurance Subscriber Name',
        placeholder: 'Name of the policy holder'
      })}
      
      ${FormComponents.createTextInput({
        id: 'secondaryInsPolicyNumber',
        label: 'Secondary Insurance Policy Number',
        placeholder: 'Policy or ID number'
      })}
      
      ${FormComponents.createDatePicker({
        id: 'secondaryInsSubscriberDob',
        label: 'Secondary Insurance Subscriber DOB'
      })}
      
      ${FormComponents.createSelect({
        id: 'secondaryInsPlanType',
        label: 'Secondary Insurance Plan Type',
        options: ['HMO', 'PPO', 'Medicare', 'Medicaid', 'Other']
      })}
      
      ${FormComponents.createSelect({
        id: 'secondaryNetworkParticipation',
        label: 'Secondary Insurance Network Participation Status',
        options: ['In-Network', 'Out-of-Network', 'Unknown']
      })}
    </div>
  `;
  
  // Combine all fields
  return `
    <div class=\"insurance-info-container\">
      ${sectionHeader}
      <div class=\"form-section-content\">
        <h4 class=\"text-lg font-medium mb-4\">Primary Insurance</h4>
        ${primaryInsName}
        ${primaryInsPhone}
        ${primaryInsSubscriberName}
        ${primaryInsPolicyNumber}
        ${primaryInsSubscriberDob}
        ${primaryInsPlanType}
        ${networkParticipation}
        
        <hr class=\"my-4 border-gray-200\">
        
        <h4 class=\"text-lg font-medium mb-4\">Secondary Insurance</h4>
        ${hasSecondaryIns}
        ${secondaryInsFields}
      </div>
    </div>
  `;
};

/**
 * Creates the provider information step of the form
 * @returns {string} HTML for the provider info step
 */
const createProviderInfoStep = () => {
  // Create section header
  const sectionHeader = FormComponents.createFormSection(
    'Provider Information', 
    'Enter details about the physician and facility'
  );
  
  // Physician information fields
  const physicianName = FormComponents.createTextInput({
    id: 'physicianName',
    label: 'Physician Name',
    placeholder: 'Full name of treating physician',
    required: true
  });
  
  const physicianNpi = FormComponents.createTextInput({
    id: 'physicianNpi',
    label: 'Physician NPI',
    placeholder: 'National Provider Identifier',
    required: true
  });
  
  const physicianTin = FormComponents.createTextInput({
    id: 'physicianTin',
    label: 'Physician TIN (Tax ID Number)',
    placeholder: 'Tax ID Number',
    required: true
  });
  
  const physicianAddress = FormComponents.createTextInput({
    id: 'physicianAddress',
    label: 'Physician Address',
    placeholder: 'Street address, City, State, ZIP',
    required: true
  });
  
  const physicianPhone = FormComponents.createTextInput({
    id: 'physicianPhone',
    label: 'Physician Contact Phone',
    placeholder: '(XXX) XXX-XXXX',
    type: 'tel',
    required: true
  });
  
  const physicianFax = FormComponents.createTextInput({
    id: 'physicianFax',
    label: 'Physician Fax',
    placeholder: '(XXX) XXX-XXXX',
    type: 'tel'
  });
  
  // Facility information fields
  const facilityName = FormComponents.createTextInput({
    id: 'facilityName',
    label: 'Facility Name',
    placeholder: 'Name of the facility where service will be provided',
    required: true
  });
  
  const facilityAddress = FormComponents.createTextInput({
    id: 'facilityAddress',
    label: 'Facility Address',
    placeholder: 'Street address, City, State, ZIP',
    required: true
  });
  
  const facilityNpi = FormComponents.createTextInput({
    id: 'facilityNpi',
    label: 'Facility NPI',
    placeholder: 'National Provider Identifier for facility'
  });
  
  const facilityTin = FormComponents.createTextInput({
    id: 'facilityTin',
    label: 'Facility TIN',
    placeholder: 'Tax ID Number for facility'
  });
  
  const contactInfo = FormComponents.createTextInput({
    id: 'contactName',
    label: 'Contact Name',
    placeholder: 'Person to contact for questions',
    required: true
  });
  
  const contactPhoneEmail = FormComponents.createTextInput({
    id: 'contactPhoneEmail',
    label: 'Contact Phone/Email',
    placeholder: 'Phone number or email address',
    required: true
  });
  
  const placeOfService = FormComponents.createSelect({
    id: 'placeOfService',
    label: 'Place of Service',
    options: [
      'Office',
      'Outpatient Hospital', 
      'Ambulatory Surgical Center (ASC)',
      'Inpatient Hospital',
      'Skilled Nursing Facility',
      'Patient Home',
      'Other'
    ],
    required: true
  });
  
  const salesRepName = FormComponents.createTextInput({
    id: 'salesRepName',
    label: 'Sales Representative Name',
    placeholder: 'Name of the MSC Wound Care sales representative'
  });
  
  // Combine all fields
  return `
    <div class=\"provider-info-container\">
      ${sectionHeader}
      <div class=\"form-section-content\">
        <h4 class=\"text-lg font-medium mb-4\">Physician Information</h4>
        ${physicianName}
        ${physicianNpi}
        ${physicianTin}
        ${physicianAddress}
        ${physicianPhone}
        ${physicianFax}
        
        <hr class=\"my-4 border-gray-200\">
        
        <h4 class=\"text-lg font-medium mb-4\">Facility Information</h4>
        ${facilityName}
        ${facilityAddress}
        ${facilityNpi}
        ${facilityTin}
        
        <hr class=\"my-4 border-gray-200\">
        
        <h4 class=\"text-lg font-medium mb-4\">Additional Information</h4>
        ${contactInfo}
        ${contactPhoneEmail}
        ${placeOfService}
        ${salesRepName}
      </div>
    </div>
  `;
};

/**
 * Creates the wound information step of the form
 * @returns {string} HTML for the wound info step
 */
const createWoundInfoStep = () => {
  // Create section header
  const sectionHeader = FormComponents.createFormSection(
    'Wound Information', 
    'Provide details about the wound and treatment'
  );
  
  // Wound information fields
  const woundType = FormComponents.createSelect({
    id: 'woundType',
    label: 'Wound Type',
    options: [
      'Diabetic Foot Ulcer',
      'Venous Leg Ulcer',
      'Pressure Ulcer',
      'Arterial Ulcer',
      'Surgical Wound',
      'Traumatic Wound',
      'Burns',
      'Other'
    ],
    required: true
  });
  
  const woundSize = FormComponents.createTextInput({
    id: 'woundSize',
    label: 'Wound Size(s)',
    placeholder: 'Length x Width x Depth in cm',
    required: true,
    helpText: 'If multiple wounds, list each one separately'
  });
  
  const woundLocation = FormComponents.createTextInput({
    id: 'woundLocation',
    label: 'Wound Location',
    placeholder: 'Anatomical location of the wound(s)',
    required: true
  });
  
  const cptCodes = FormComponents.createTextInput({
    id: 'cptCodes',
    label: 'Application CPT Code(s)',
    placeholder: 'CPT codes for the procedure',
    required: true
  });
  
  const diagnosisCodes = FormComponents.createTextInput({
    id: 'diagnosisCodes',
    label: 'ICD-10 Diagnosis Code(s)',
    placeholder: 'ICD-10 codes',
    required: true,
    helpText: 'List primary diagnosis first'
  });
  
  const procedureDate = FormComponents.createDatePicker({
    id: 'procedureDate',
    label: 'Date of Procedure/Application',
    required: true
  });
  
  const productInfo = FormComponents.createTextInput({
    id: 'productInfo',
    label: 'Product Information/Type',
    placeholder: 'e.g., CompleteAA, Membrane Wrap, etc.',
    required: true
  });
  
  const additionalInfo = FormComponents.createTextarea({
    id: 'additionalInfo',
    label: 'Additional Information',
    placeholder: 'Any other details that may be relevant for insurance verification',
    rows: 3
  });
  
  // Combine all fields
  return `
    <div class=\"wound-info-container\">
      ${sectionHeader}
      <div class=\"form-section-content\">
        ${woundType}
        ${woundSize}
        ${woundLocation}
        ${cptCodes}
        ${diagnosisCodes}
        ${procedureDate}
        ${productInfo}
        ${additionalInfo}
      </div>
    </div>
  `;
};

/**
 * Creates the review step of the form
 * @returns {string} HTML for the review step
 */
const createReviewStep = () => {
  // Create section header
  const sectionHeader = FormComponents.createFormSection(
    'Review & Submit', 
    'Please review all information before submitting'
  );
  
  // Review sections
  const reviewContent = `
    <div class=\"review-section mb-4\">
      <h4 class=\"text-lg font-medium mb-2\">Patient Information</h4>
      <div id=\"patientInfoReview\" class=\"review-content p-3 bg-gray-50 rounded-md\"></div>
    </div>
    
    <div class=\"review-section mb-4\">
      <h4 class=\"text-lg font-medium mb-2\">Insurance Information</h4>
      <div id=\"insuranceInfoReview\" class=\"review-content p-3 bg-gray-50 rounded-md\"></div>
    </div>
    
    <div class=\"review-section mb-4\">
      <h4 class=\"text-lg font-medium mb-2\">Provider Information</h4>
      <div id=\"providerInfoReview\" class=\"review-content p-3 bg-gray-50 rounded-md\"></div>
    </div>
    
    <div class=\"review-section mb-4\">
      <h4 class=\"text-lg font-medium mb-2\">Wound Information</h4>
      <div id=\"woundInfoReview\" class=\"review-content p-3 bg-gray-50 rounded-md\"></div>
    </div>
  `;
  
  // Verification and terms
  const termsCheckbox = FormComponents.createCheckbox({
    id: 'termsAgreement',
    label: 'I verify that all the information provided is accurate and complete.',
    name: 'termsAgreement',
    required: true
  });
  
  const signatureField = FormComponents.createSignatureField({
    id: 'signature',
    label: 'Signature',
    required: true,
    helpText: 'Sign using mouse or touch'
  });
  
  // Combine all sections
  return `
    <div class=\"review-container\">
      ${sectionHeader}
      <div class=\"form-section-content\">
        ${reviewContent}
        
        <hr class=\"my-4 border-gray-200\">
        
        <div class=\"verification-section\">
          <h4 class=\"text-lg font-medium mb-2\">Verification</h4>
          ${termsCheckbox}
          ${signatureField}
        </div>
      </div>
    </div>
  `;
};

/**
 * Initialize the IVR form with event handlers and validation
 */
const initIVRForm = () => {
  // Show/hide surgical period info based on selection
  document.querySelectorAll('input[name=\"surgicalPeriod\"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const surgicalInfoContainer = document.getElementById('surgicalInfoContainer');
      surgicalInfoContainer.style.display = this.value === 'yes' ? 'block' : 'none';
    });
  });
  
  // Show/hide secondary insurance fields based on selection
  document.querySelectorAll('input[name=\"hasSecondaryIns\"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const secondaryInsContainer = document.getElementById('secondaryInsContainer');
      secondaryInsContainer.style.display = this.value === 'yes' ? 'block' : 'none';
    });
  });
  
  // Initialize signature pad
  initSignaturePad('signature_canvas', 'signature');
  
  // Fill review sections on final step
  document.getElementById('nextStep')?.addEventListener('click', function() {
    const currentStepDisplay = [...document.querySelectorAll('.form-step')].findIndex(step => step.style.display !== 'none');
    
    // If moving to the review step (which is the last step, index 4)
    if (currentStepDisplay === 3) {
      updateReviewSection();
    }
  });
  
  // Initialize multi-step form
  initMultiStepForm({
    formId: 'ivrForm',
    stepClass: 'form-step',
    nextBtnId: 'nextStep',
    prevBtnId: 'prevStep',
    submitBtnId: 'submitForm',
    stepIndicatorId: 'stepIndicator',
    validateStep: validateCurrentStep,
    onSubmit: submitIVRForm
  });
};

/**
 * Update the review section with entered data
 */
const updateReviewSection = () => {
  // Update patient info review
  document.getElementById('patientInfoReview').innerHTML = `
    <p><strong>Name:</strong> ${document.getElementById('patientName').value}</p>
    <p><strong>DOB:</strong> ${document.getElementById('patientDob').value}</p>
    <p><strong>Address:</strong> ${document.getElementById('patientAddress').value}</p>
    <p><strong>Phone:</strong> ${document.getElementById('patientPhone').value}</p>
    <p><strong>Permission to Contact:</strong> ${getRadioValue('contactPermission')}</p>
    <p><strong>Skilled Nursing Facility:</strong> ${getRadioValue('nursingFacility')}</p>
    <p><strong>Global Surgical Period:</strong> ${getRadioValue('surgicalPeriod')}</p>
    ${getRadioValue('surgicalPeriod') === 'Yes' ? 
      `<p><strong>CPT Code:</strong> ${document.getElementById('cptCode').value}</p>
       <p><strong>Surgery Date:</strong> ${document.getElementById('surgeryDate').value}</p>` : 
      ''}
  `;
  
  // Update insurance info review
  document.getElementById('insuranceInfoReview').innerHTML = `
    <p><strong>Primary Insurance:</strong> ${document.getElementById('primaryInsName').value}</p>
    <p><strong>Phone:</strong> ${document.getElementById('primaryInsPhone').value}</p>
    <p><strong>Subscriber Name:</strong> ${document.getElementById('primaryInsSubscriberName').value}</p>
    <p><strong>Policy Number:</strong> ${document.getElementById('primaryInsPolicyNumber').value}</p>
    <p><strong>Subscriber DOB:</strong> ${document.getElementById('primaryInsSubscriberDob').value}</p>
    <p><strong>Plan Type:</strong> ${document.getElementById('primaryInsPlanType').value}</p>
    <p><strong>Network Status:</strong> ${document.getElementById('networkParticipation').value}</p>
    
    ${getRadioValue('hasSecondaryIns') === 'Yes' ? 
      `<hr class=\"my-2\">
       <p><strong>Secondary Insurance:</strong> ${document.getElementById('secondaryInsName').value}</p>
       <p><strong>Phone:</strong> ${document.getElementById('secondaryInsPhone').value}</p>
       <p><strong>Subscriber Name:</strong> ${document.getElementById('secondaryInsSubscriberName').value}</p>
       <p><strong>Policy Number:</strong> ${document.getElementById('secondaryInsPolicyNumber').value}</p>
       <p><strong>Subscriber DOB:</strong> ${document.getElementById('secondaryInsSubscriberDob').value}</p>
       <p><strong>Plan Type:</strong> ${document.getElementById('secondaryInsPlanType').value}</p>
       <p><strong>Network Status:</strong> ${document.getElementById('secondaryNetworkParticipation').value}</p>` : 
      ''}
  `;
  
  // Update provider info review
  document.getElementById('providerInfoReview').innerHTML = `
    <p><strong>Physician Name:</strong> ${document.getElementById('physicianName').value}</p>
    <p><strong>NPI:</strong> ${document.getElementById('physicianNpi').value}</p>
    <p><strong>TIN:</strong> ${document.getElementById('physicianTin').value}</p>
    <p><strong>Address:</strong> ${document.getElementById('physicianAddress').value}</p>
    <p><strong>Phone:</strong> ${document.getElementById('physicianPhone').value}</p>
    <p><strong>Fax:</strong> ${document.getElementById('physicianFax').value}</p>
    
    <hr class=\"my-2\">
    <p><strong>Facility Name:</strong> ${document.getElementById('facilityName').value}</p>
    <p><strong>Facility Address:</strong> ${document.getElementById('facilityAddress').value}</p>
    <p><strong>Facility NPI:</strong> ${document.getElementById('facilityNpi').value}</p>
    <p><strong>Facility TIN:</strong> ${document.getElementById('facilityTin').value}</p>
    
    <hr class=\"my-2\">
    <p><strong>Contact Name:</strong> ${document.getElementById('contactName').value}</p>
    <p><strong>Contact Info:</strong> ${document.getElementById('contactPhoneEmail').value}</p>
    <p><strong>Place of Service:</strong> ${document.getElementById('placeOfService').value}</p>
    <p><strong>Sales Rep:</strong> ${document.getElementById('salesRepName').value}</p>
  `;
  
  // Update wound info review
  document.getElementById('woundInfoReview').innerHTML = `
    <p><strong>Wound Type:</strong> ${document.getElementById('woundType').value}</p>
    <p><strong>Wound Size(s):</strong> ${document.getElementById('woundSize').value}</p>
    <p><strong>Wound Location:</strong> ${document.getElementById('woundLocation').value}</p>
    <p><strong>CPT Code(s):</strong> ${document.getElementById('cptCodes').value}</p>
    <p><strong>Diagnosis Code(s):</strong> ${document.getElementById('diagnosisCodes').value}</p>
    <p><strong>Procedure Date:</strong> ${document.getElementById('procedureDate').value}</p>
    <p><strong>Product Type:</strong> ${document.getElementById('productInfo').value}</p>
    <p><strong>Additional Info:</strong> ${document.getElementById('additionalInfo').value}</p>
  `;
};

/**
 * Get the value of a selected radio button
 * @param {string} name - Name attribute of the radio group
 * @returns {string} Selected value or empty string
 */
const getRadioValue = (name) => {
  const selected = document.querySelector(`input[name=\"${name}\"]:checked`);
  return selected ? selected.value : '';
};

/**
 * Validate the current form step
 * @param {number} stepIndex - Zero-based index of current step
 * @returns {boolean} Whether validation passed
 */
const validateCurrentStep = (stepIndex) => {
  let isValid = true;
  
  // Validation for patient info step
  if (stepIndex === 0) {
    // Validate required fields
    isValid = FormValidation.validateRequired('patientName', 'Patient Name') && isValid;
    isValid = FormValidation.validateRequired('patientDob', 'Date of Birth') && isValid;
    isValid = FormValidation.validateRequired('patientAddress', 'Patient Address') && isValid;
    isValid = FormValidation.validateRequired('patientPhone', 'Patient Phone Number') && isValid;
    
    // Validate radio button groups
    if (!getRadioValue('contactPermission')) {
      showFieldError('contactPermission', 'Please select an option');
      isValid = false;
    }
    
    if (!getRadioValue('nursingFacility')) {
      showFieldError('nursingFacility', 'Please select an option');
      isValid = false;
    }
    
    if (!getRadioValue('surgicalPeriod')) {
      showFieldError('surgicalPeriod', 'Please select an option');
      isValid = false;
    }
    
    // If under surgical period, validate related fields
    if (getRadioValue('surgicalPeriod') === 'yes') {
      isValid = FormValidation.validateRequired('cptCode', 'CPT Code') && isValid;
      isValid = FormValidation.validateRequired('surgeryDate', 'Surgery Date') && isValid;
    }
  }
  
  // Validation for insurance info step
  else if (stepIndex === 1) {
    // Validate primary insurance fields
    isValid = FormValidation.validateRequired('primaryInsName', 'Primary Insurance Name') && isValid;
    isValid = FormValidation.validateRequired('primaryInsPhone', 'Primary Insurance Phone') && isValid;
    isValid = FormValidation.validateRequired('`
}