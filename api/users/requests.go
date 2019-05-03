package users

import (
	"errors"
	"fmt"
	"github.com/codewinks/cwblog/api/models"
	"net/http"
)

type UserRequest struct {
	*models.User
}

func (u *UserRequest) Bind(r *http.Request) error {
	// u.User is nil if no Post fields are sent in the request. Return an
	// error to avoid a nil pointer dereference.
	if u.User == nil {
		return errors.New("Missing required Post fields.")
	}

	if u.User.FirstName == "" {
		return errors.New("Missing title")
	}

	if u.User.Email == "" {
		return errors.New("Missing site id")
	}

	// a.User is nil if no Userpayload fields are sent in the request. In this app
	// this won't cause a panic, but checks in this Bind method may be required if
	// a.User or futher nested fields like a.User.Name are accessed elsewhere.

	fmt.Println(u.User)

	return nil
}