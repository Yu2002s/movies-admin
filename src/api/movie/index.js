import request from '@/utils/request.js'

export const reqGetMoviesList = (data) =>
  request.get('/movies/list', {
    params: data
  })

export const reqUpdateMovie = (data) => request.put('/movies', data)

export const reqDeleteMovie = (id) => request.delete(`/movies/${id}`)