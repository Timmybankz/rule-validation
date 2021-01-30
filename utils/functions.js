
exports.successResponse = (message, data) => {
    return { status: 200, resPayload: { message, status: 'success', data }}
}

exports.errorResWithoutData = (message) => {
    return { message, status: 'error', data: null }
}

exports.errorResWithData = (message, data) => {
    return { status: 400, resPayload: { message, status: 'error', data }}
}

exports.conditionsToDataType = (condition, condition_value) => {
    return ((condition === 'gte' || condition === 'gt' ) && 
            (typeof condition_vale !== 'number' || typeof condition_vale !== null))
}

exports.getMissingFields = (error) => {
    let errorMsg = '';
    if (error.length === 1) {
       errorMsg = `${error[0].path[0]} field is required for rule object.`;
    } 
    else {
        let missingFieldsArray = [];
        for (err of error) {
            missingFieldsArray.push(err.path['0']);
        }
        errorMsg = `Fields ${missingFieldsArray.join(' and ')} are required for rule object.`;
    }
    return this.errorResponse(errorMsg);
}

exports.meetConditions = (condition, condition_value, field_value) => {
    switch (condition) {
        case 'eq':
            return (field_value === condition_value);
        case 'neq':
            return (field_value !== condition_value);
        case 'gt':
            return (field_value > condition_value);
        case 'gte':
            return (field_value >= condition_value);
        case 'contains':
            return (field_value.toString().includes(condition_value.toString()));
    }
}

exports.validationStatus = (rule, field_value) => {

    const { field, condition, condition_value } = rule;
    const checkIfValid = this.meetConditions(condition, condition_value, field_value);
    let data = {
        validation: {
            error: false,
            field,
            field_value,
            condition,
            condition_value
        }
    };

    if (!checkIfValid) {
        data.validation.error = true;
        return this.errorResWithData(`field ${field} failed validation.`, data);
    }

    return this.successResponse(`field ${field} successfully validated.`, data);
}
