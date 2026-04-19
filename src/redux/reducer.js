import {
    GET_BOOKS,
    GET_PEOPLE,
    GET_LOANS,
  } from "./action.js";


const initialState = {
  books: [],
  allBooks: [],
  people: [],
  loans: [],
};

function reducer(state = initialState, action) {
const allBooks = state.allBooks;

  switch (action.type) {
    case GET_BOOKS:
      return {
        ...state,
        books: action.payload.book,
        allBooks: action.payload,
      };
      
    case GET_PEOPLE:
      return {
        ...state,
        people: action.payload.people,
      };

    case GET_LOANS:
      return {
        ...state,
        loans: action.payload.loans,
      };
    default:
      return state;
  }
}

export default reducer;