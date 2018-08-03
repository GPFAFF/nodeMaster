# nodeMaster


## What do I do?

### 1. Listen on a PORT and accept incoming HTTP requests for POST, GET, PUT, DELETE and HEAD.

### 2. API allows a client to connect then create a new user, then edit and delete that user.

### 3. API allows a user to "sign in" which gives them a token that they can use for subsequent authenticated requests.

### 4. API allows user to sign out which invalidates the token.

### 5. API allows a "signed-in" user to check their token to create a new check. I.E. website is up or down.

### 6. A "signed-in" user cna edit or delete any of their checks.  Max of 5.

### 7. In background workers perform all the checks at the appropriate times, and sends alerts (using Twillio) to the users when a check changes its state from up to down or vice versa.
