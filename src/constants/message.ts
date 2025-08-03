const MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    SUCCESS_LOGIN: 'Successful login',
    TOKEN_INVALID: 'Token Invalid',
    FORBIDDEN: 'You dont have any permission'
  },
  COMMON: {
    VALIDATION_FAILED: 'Validation failed',
    INTERNAL_SERVER_ERROR: 'Internal server errors!',
    NOT_FOUND: 'Data not found'
  },
  TICKET: {
    SUCCESS_RETRIEVED_DATA: 'Successful get data of ticket',
    SUCCESS_CREATED_DATA: 'Successful created data',
    SUCCESS_UPDATE_DATA: 'Successful updated / moved data',
    FORBIDDEN: 'Only :param1 ticket can be escalated to :param2',
    MAX_ESCALATION: 'Ticket already at max escalation'
  }
}

export default MESSAGES