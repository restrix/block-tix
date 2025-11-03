const res = await fetch("/api/rest/v1/movies?select=*&order=title.asc");
const data = await res.json();
console.log(data);
