package postgres

import (
	"errors"
	"fmt"
	"strings"

	"gorm.io/gorm"
)

var SQLStateMessages = map[string]string{
	// Class 00 - Successful Completion
	"00000": "Successful completion",

	// Class 01 - Warning
	"01000": "Warning",
	"01002": "Disconnect error",
	"01003": "Null value eliminated in aggregate",
	"01004": "String data right-truncated",
	"01006": "Privilege not revoked",
	"01007": "Privilege not granted",

	// Class 08 - Connection Exception
	"08000": "Connection exception",
	"08001": "SQL-client unable to establish SQL-connection",
	"08003": "Connection does not exist",
	"08004": "SQL-server rejected the connection",
	"08006": "Connection failure",
	"08007": "Transaction resolution unknown",

	// Class 22 - Data Exception
	"22000": "Data exception",
	"22001": "String data right-truncated",
	"22002": "Indicator variable required but not supplied",
	"22003": "Numeric value out of range",
	"22004": "Null value not allowed",
	"22005": "Error in assignment",
	"22007": "Invalid datetime format",
	"22008": "Datetime field overflow",
	"22012": "Division by zero",
	"22015": "Interval field overflow",
	"22018": "Invalid character value for cast",
	"22019": "Invalid escape character",
	"22021": "Character not in repertoire",
	"22022": "Indicator overflow",
	"22023": "Invalid parameter value",
	"22024": "Unterminated C string",
	"22025": "Invalid escape sequence",
	"22026": "String data length mismatch",

	// Class 23 - Integrity Constraint Violation
	"23000": "Integrity constraint violation (general)",
	"23001": "Restrict violation",
	"23502": "Not null violation",
	"23503": "Foreign key violation",
	"23505": "Unique constraint violation",
	"23514": "Check constraint violation",

	// Class 25 - Invalid Transaction State
	"25000": "Invalid transaction state",
	"25001": "Active SQL-transaction",
	"25002": "Branch transaction already active",
	"25008": "Held cursor requires same isolation level",
	"25P01": "No active SQL-transaction",
	"25P02": "In failed SQL-transaction",
	"25P03": "Idle in transaction session timeout",

	// Class 28 - Invalid Authorization
	"28000": "Invalid authorization specification",

	// Class 3B - Savepoint Exception
	"3B000": "Savepoint exception",
	"3B001": "Invalid savepoint specification",

	// Class 40 - Transaction Rollback
	"40000": "Transaction rollback",
	"40001": "Serialization failure",
	"40002": "Transaction integrity constraint violation",
	"40003": "Statement completion unknown",

	// Class 42 - Syntax Error or Access Rule Violation
	"42000": "Syntax error or access rule violation",
	"42501": "Insufficient privilege",
	"42601": "Syntax error",
	"42602": "Invalid name",
	"42611": "Duplicate column",
	"42622": "Name too long",
	"42701": "Duplicate column",
	"42702": "Ambiguous column",
	"42703": "Undefined column",
	"42704": "Undefined object",
	"42710": "Duplicate object",
	"42712": "Duplicate alias",
	"42723": "Duplicate function",
	"42725": "Ambiguous function",
	"42803": "Grouping error",
	"42804": "Datatype mismatch",
	"42809": "Wrong object type",
	"42830": "Invalid foreign key",
	"42846": "Cannot coerce",
	"42883": "Undefined function",
	"42939": "Reserved name",

	// PostgreSQL-specific Class 42 codes
	"42P01": "Undefined table",
	"42P02": "Undefined parameter",
	"42P03": "Duplicate cursor",
	"42P04": "Duplicate database",
	"42P05": "Duplicate prepared statement",
	"42P06": "Duplicate schema",
	"42P07": "Duplicate table",
	"42P08": "Ambiguous parameter",
	"42P09": "Ambiguous alias",
	"42P10": "Invalid column reference",
	"42P11": "Invalid cursor definition",
	"42P12": "Invalid database definition",
	"42P13": "Invalid function definition",
	"42P14": "Invalid prepared statement definition",
	"42P15": "Invalid schema definition",
	"42P16": "Invalid transaction termination",
	"42P17": "Invalid transaction isolation level",
	"42P18": "Indeterminate datatype",
	"42P19": "Invalid recursion",
	"42P20": "Windowing error",
}

type pgError struct {
	Err      error
	SQLState string
}

func getErrorMessageForSQLState(SQLState string) string {
	msg, found := SQLStateMessages[SQLState]
	if !found {
		msg = fmt.Sprintf("Unknown DB error with code: %s", SQLState)
	}
	return msg
}

func MapSQLStateToErrorMessage(err error) pgError {
	if err == nil {
		return pgError{
			Err: errors.New("no error received"),
		}
	}

	if err == gorm.ErrRecordNotFound {
		return pgError{Err: gorm.ErrRecordNotFound}
	}

	errMsg := err.Error()
	sqlState := extractSQLState(errMsg)
	friendlyError := err.Error()

	if sqlState != "" {
		friendlyError = getErrorMessageForSQLState(sqlState)
	}

	return pgError{
		SQLState: sqlState,
		Err:      errors.New(friendlyError),
	}
}

func extractSQLState(errMsg string) string {
	start := strings.Index(errMsg, "SQLSTATE")
	if start == -1 {
		return ""
	}
	end := start + len("SQLSTATE ") + 5
	if end > len(errMsg) {
		end = len(errMsg)
	}
	return errMsg[start+9 : end]
}
