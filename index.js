const form = document.querySelector("form");
const list = document.querySelector(".list");
const button = document.queryCommandValue(".more");

// В этих двух константах будет прописан путь и код для доступа к бэку
const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";
const API = "9cTjAjlRB53wyhaFk5VzXcBu5GiPU6fK";

let pageToFetch = 0;
let keyword = "";

// Функция, которая делает запрос на сервер и что-то возвращает
function fetchEvent(page, keyword) {
  // передаем настройки (апикей это как пример), квери параметр в каждой айпишки свой надо смотреть в доках
  const params = new URLSearchParams({
    apikey: API,
    page,
    keyword,
    size: 20,
  });

  return fetch(`${BASE_URL}?${params}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch((error) => console.log(error));
}

// Функция, которая будет отвечать за взаимодействие с распарсиными даннымиюСпецефическая логика связанная с интерфейсом
function getEvents(page, keyword) {
  fetchEvent(page, keyword).then((data) => {
    if (data.page.totalElements === 0) {
      button.classList.add("invisible");
      alert("There are no events by keyword ${keyword}");
    }

    //   Св-во embadded берется из большого обьекта, который приходит из сервера
    const events = data?._embedded?.events;
    if (events) {
      renderEvents(events);
    }

    if (pageToFetch === data.page.totalPages - 1) {
      button.classList.add("invisible");
      alert("No more pages!");
      return;
    }

    pageToFetch += 1;
    if (data.page.totalPages > 1) {
      button.classList.remove("invisible");
    }
  });
}

// Функция, которая будет принимать массив данных и рендерить их
function renderEvents(events) {
  const markup = events
    .map(({ name, images }) => {
      return `<li>
      <img src='${images[0].url}' alt='${name}'>
      <p>${name}</p>
      </li>`;
    })
    .join("");
  list.insertAdjacentHTML("beforeend", markup);
}

//Далее обращаемся к форме, чтобы при сабмите на форму происходил поиск
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = event.target.elements.query.value;
  keyword = query;
  pageToFetch = 0;
  list.innerHTML = "";
  if (!query) {
    return;
  }
  getEvents(pageToFetch, query);
});

// Далее нужно обратиться к кнопке, чтобы подгружать другие страницы
button.addEventListener("click", () => {
  getEvents(pageToFetch, keyword);
});
