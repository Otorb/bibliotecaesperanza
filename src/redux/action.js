import axios from "axios";
export const GET_BOOKS = "GET_BOOKS";
export const GET_PEOPLE = "GET_PEOPLE";
export const GET_LOANS = "GET_LOANS";



 const API = process.env.NEXT_PUBLIC_API_URL;


// functions get

export function getBooks() {
  return async function (dispatch) {
    console.log("entre");
    
    var json = await axios.get(`${API}/book`);
    return dispatch({
      type: "GET_BOOKS",
      payload: json.data,
    });
  };
}


export function getPeople() {
  return async function (dispatch) {
    var json = await axios.get(`${API}/people`);
    return dispatch({
      type: "GET_PEOPLE",
      payload: json.data,
    });
  };
}

export function getLoans() {
  return async function (dispatch) {
    var json = await axios.get(`${API}/loan`);
    return dispatch({
      type: "GET_LOANS",
      payload: json.data,
    });
  };
}


export const getLoanStatus = (loan) => {
  if (loan.returned) return "returned";

  const checkout = new Date(loan.checkoutDate);
  const now = new Date();

  const diffDays = Math.floor((now - checkout) / (1000 * 60 * 60 * 24));

  if (diffDays > 7) return "overdue"; // vencido
  if (diffDays >= 5) return "warning"; // por vencer

  return "active";
};