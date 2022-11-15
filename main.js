(async () => {
  /* 초기화 */
  const rMovieEl = document.querySelector(".result__movies");
  const rLoadEl = document.querySelector(".result__load");
  const rShortEl = document.querySelector(".result__short");
  const rNotEl = document.querySelector(".result__nothing");
  const moreBtnEl = document.querySelector(".btn");
  const sKeywordEl = document.querySelector(".search__text");
  const sTypeEl = document.querySelector(".search__type");
  const sNumEl = document.querySelector(".search__num");
  const sYearEl = document.querySelector(".search__year");
  const sBtnEl = document.querySelector(".search__btn");
  let page = 1;
  // 개봉년도 옵션
  for (let i = 2022; i >= 1985; i--) {
    const op = document.createElement("option");
    op.value = `${i}`;
    op.innerText = `${i}`;
    sYearEl.append(op);
  }
  localStorage.clear();

  /* 이벤트 리스너 */
  // 1.검색 버튼
  sBtnEl.addEventListener("click", startSearch);
  // 2.검색 엔터
  sKeywordEl.addEventListener("keyup", (key) => {
    if (key.keyCode === 13) startSearch();
  });
  // 3.더보기 버튼
  moreBtnEl.addEventListener("click", async () => {
    rLoadEl.classList.remove("hidden");
    const movies = await getMovies();
    renderMovies(movies);
    rLoadEl.classList.add("hidden");
  });

  /* 함수 목록*/
  // 1.영화 정보 찾기
  async function startSearch() {
    clearMovies();

    rLoadEl.classList.remove("hidden");
    rShortEl.classList.add("hidden");
    rNotEl.classList.add("hidden");

    const keyword = sKeywordEl.value;
    if (keyword.length < 3) {
      rLoadEl.classList.add("hidden");
      rShortEl.classList.remove("hidden");
      return;
    }

    const num = sNumEl.options[sNumEl.selectedIndex].value;
    for (let i = 0; i < num; i++) {
      const movies = await getMovies();
      if (movies) {
        renderMovies(movies);
      } else if (i !== 0 && movies === false) {
        // 30, 20개 찾을때
        moreBtnEl.classList.add("hidden");
        break;
      } else {
        rLoadEl.classList.add("hidden");
        rNotEl.classList.remove("hidden");
        return;
      }
    }
    rLoadEl.classList.add("hidden");
  }

  // 2.영화 정보 가져오기
  async function getMovies() {
    const type = sTypeEl.options[sTypeEl.selectedIndex].value;
    const year = sYearEl.options[sYearEl.selectedIndex].value;

    const res = await fetch(
      `https://www.omdbapi.com/?apikey=7035c60c&s=${sKeywordEl.value}&page=${page}&type=${type}&y=${year}`
    );
    page++;
    const result = await res.json();

    if (result.Response === "False") return false;

    if (result.Search.length !== 10) {
      moreBtnEl.classList.add("hidden");
    } else moreBtnEl.classList.remove("hidden");

    return result.Search;
  }

  // 3.영화 목록 그려주기
  function renderMovies(movies) {
    for (const movie of movies) {
      const el = document.createElement("div");
      el.classList.add("movie");

      const h1El = document.createElement("h1");
      h1El.textContent = movie.Title;
      const imgEl = document.createElement("img");

      if (movie.Poster === "N/A") imgEl.src = "./images/nothing.jpg";
      else imgEl.src = movie.Poster;

      el.append(imgEl, h1El);
      // el.addEventListener("click", () => {
      //   localStorage.setItem("poster", movie.Poster);
      //   localStorage.setItem("title", movie.Title);
      //   localStorage.setItem("type", movie.Type);
      //   localStorage.setItem("year", movie.Year);
      // });

      rMovieEl.append(el);
    }
  }

  // 4.영화 목록 클리어
  function clearMovies() {
    page = 1;
    const moviesEl = document.querySelectorAll(".movie");
    for (let x of moviesEl) {
      x.remove();
    }
  }
})();
