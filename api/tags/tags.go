package tags

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/go-pg/pg/v10"

	"github.com/codewinks/cwblog/api/models"
	"github.com/codewinks/cwblog/api/core"
	"github.com/codewinks/cwblog/api/middleware"
)

type key int

const (
	tagKey key = iota
)

//Handler consists of the DB connection and Routes
type Handler core.Handler

//Routes consists of the route method declarations for Tags.
func Routes(r chi.Router, db *pg.DB) chi.Router {
	cw := &Handler{DB: db}
	r.Route("/tags", func(r chi.Router) {
		r.Group(func(r chi.Router) {
			r.Use(middleware.IsAuthenticated)
			r.Get("/", cw.List)
			r.Post("/", cw.Store)

			r.Route("/{tagId}", func(r chi.Router) {
				r.Use(cw.TagCtx)
				r.Get("/", cw.Get)
				r.Put("/", cw.Update)
				r.Delete("/", cw.Delete)
			})
		})

		r.With(cw.TagCtx).Get("/slug/{tagSlug}", cw.Get)
	})

	return r
}

//List handler returns all tags in JSON format.
func (cw *Handler) List(w http.ResponseWriter, r *http.Request) {
	var tags []models.Tag
	err := cw.DB.Model(&tags).Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
	}

	render.JSON(w, r, tags)
}

//Store handler creates a new tag and returns the tag in JSON format.
func (cw *Handler) Store(w http.ResponseWriter, r *http.Request) {
	data := &TagRequest{}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	var tag models.Tag
	exists, err := cw.DB.Model(&tag).Where("slug = ?", data.Tag.Slug).Exists()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	if exists {
		render.Render(w, r, core.ErrConflict(errors.New("Tag already exists with that slug.")))
		return
	}

	_, err = cw.DB.Model(data.Tag).Insert()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	fmt.Printf("====%#v \n", tag)

	render.JSON(w, r, tag)
}

//Get handler returns a tag by the provided {tagId}
func (cw *Handler) Get(w http.ResponseWriter, r *http.Request) {
	fmt.Println("-----")
	tag := r.Context().Value(tagKey).(*models.Tag)

	if tag == nil {
		render.Render(w, r, core.ErrNotFound)
		return
	}

	render.JSON(w, r, tag)
}

//Update handler updates a tag by the provided {tagId}
func (cw *Handler) Update(w http.ResponseWriter, r *http.Request) {
	tag := r.Context().Value(tagKey).(*models.Tag)

	err := cw.DB.Model(tag).WherePK().Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	data := &TagRequest{Tag: tag}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	tag = data.Tag

	_, err = cw.DB.Model(tag).WherePK().Update()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	err = cw.DB.Model(tag).WherePK().Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	render.JSON(w, r, tag)
}

//Delete handler deletes a tag by the provided {tagId}
func (cw *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	tag := r.Context().Value(tagKey).(*models.Tag)

	_, err := cw.DB.Model(tag).WherePK().Delete()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	render.JSON(w, r, tag)
}

//TagCtx handler loads a tag by either {tagId} or {tagSlug}
func (cw *Handler) TagCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var tag models.Tag
		var err error

		if tagId := chi.URLParam(r, "tagId"); tagId != "" {
			err = cw.DB.Model(&tag).Where("id = ?", tagId).First()
		} else if tagSlug := chi.URLParam(r, "tagSlug"); tagSlug != "" {
			err = cw.DB.Model(&tag).Where("slug = ?", tagSlug).First()
		} else {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		if err != nil {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		ctx := context.WithValue(r.Context(), tagKey, &tag)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
