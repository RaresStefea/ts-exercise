// Task: parseUserConfig (TypeScript + runtime validation) 

// Goal: Implement a function that takes a JSON string and returns either a valid User object or a friendly error.

// Starter types (do not change)
type Role = "intern" | "mentor" | "admin";

type User = {
  id: string;
  email: string;
  role: Role;
};


type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };



function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

function err(error: string): Result<never> {
  return { ok: false, error };
}


function narrowRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRole(v: unknown): v is Role {
  return v === "intern" || v === "mentor" || v === "admin";
}

function isUser(v: unknown): v is User {
  return ( narrowRecord(v) && typeof v.id === "string" && typeof v.email === "string" && isRole(v.role) );
}

function checkRecord(value: unknown): Result<Record<string, unknown>> {
  if (typeof value !== "object" || value === null) {
    return err(`Record must be an object and not empty!`);
  }
  if (Array.isArray(value)) {
    return err(`Record must be an object, not an array!`);
  }
  return ok(value as Record<string, unknown>);
}


// [1] Implement
 function parseUserConfig(input: string): Result<User>
{   let jsonObject: unknown;
        
    try {
        jsonObject = JSON.parse(input);
    } catch {
        return err(`JSON shape is not valid!`);
    }

    if (!isUser(jsonObject)) {
        return err(`Invalid User shape!`);
    }

    return ok(jsonObject);

}
// It must:
// 1. Return { ok:false, error: "Invalid JSON" } if the string is not valid JSON
// 2. Return { ok:false, error: "Invalid User shape" } if if JSON is valid but not a valid User
// 3. Return { ok:true, value: user } if everything is valid

// Rules:
// Don’t use any
// Don’t use as User / as any to force the type
// The result must be correct based on runtime checks

// Sample input (for testing)
const inputs = [
  '{"id":"u1","email":"a@b.com","role":"intern"}', // ok
  '{"id":"u2","email":"a@b.com","role":"boss"}',   // shape error
  '{"id":123,"email":"a@b.com","role":"intern"',   // invalid JSON
  '{"id":123,"email":"a@b.com","role":"intern"}',  // shape error
];

for (const input of inputs){
console.log(`EXERCISE 1: `,parseUserConfig(input));
}

// [2] Parse list of users
// Implement
function parseUsersConfig(input: string): Result<User[]>
{
  
  let jsonObject: unknown;

  try {
    jsonObject = JSON.parse(input);
  } catch {
    return err(`JSON shape is not valid!`);
  }

  if (!Array.isArray(jsonObject)) {
    return err(`An array of Users is expected!`);
  }

  const users: User[] = [];

  for (const [key, value] of jsonObject.entries()) {
    
    const entry = checkRecord(value);
    
    if (!entry.ok) {
      return err(`ERROR: At index ${key}: ${entry.error}`);
    }

    const _object = entry.value;

    const id = _object["id"];

    if (typeof id !== "string") {
      return err(`ERROR: At index ${key}, id attribute must be a string!`);
    }

    const email = _object["email"];
    
    if (typeof email !== "string") {
      return err(`ERROR: at index ${key}, email attribute must be a string!`);
    }

    const role = _object["role"];
   
    if (!isRole(role)) {
      return err(`ERROR: ${key}: role attribute must be intern, mentor or admin!`);
    }

    users.push({ id, email, role });
  }

  return ok(users);

}



// Sample input (for testing)

const usersInputs = [
  `[{"id":"u1","email":"a@b.com","role":"intern"},{"id":"u2","email":"c@d.com","role":"mentor"}]`, // valid

  `[{"id":"u1","email":"a@b.com","role":"intern"},{"id":"u2","email":"c@d.com","role":"me"}]`, // invalid

  `[{"id":"u1","email":"a@b.com","role":"boss"}]`, // shape error

  `["HELLOOOO"]`, // shape error

  `[{"email":"a@b.com","role":"intern"}]`, // shape error

  `[{"id":"u1","email":"a@b.com","role":"intern"}`, // invalid JSON

  `{"id":"u1","email":"a@b.com","role":"intern"}`, // not an array
];

for (const input of usersInputs) {
   console.log(`EXERCISE 2: `,parseUsersConfig(input));
}


// Rules:
// JSON must be an array
// Every element must be a valid User
// If JSON is invalid -> "Invalid JSON"
// If JSON is valid but not an array or any element is invalid -> "Invalid Users shape"

// [3] Better error messages (advanced)
// Improve errors so they are more specific than "Invalid User shape".
// Examples:
// "Missing field: id"
// "Invalid type for id (expected string)"
// "Invalid role (expected intern|mentor|admin)"

// What to submit:
// * exercise.ts with your implementations
// * A short console.log demo that shows outputs for the sample inputs
