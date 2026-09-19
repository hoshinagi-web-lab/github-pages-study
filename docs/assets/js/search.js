const form = document.querySelector("#search-form");
const input = document.querySelector("#search-input");
const areaSelect = document.querySelector("#search-area");
const submitButton = document.querySelector("#search-submit");
const status = document.querySelector("#search-status");
const results = document.querySelector("#search-results");

let pagefind;

function clearResults() {
  results.replaceChildren();
}

function createResultItem(result) {
  const item = document.createElement("article");
  item.className = "search-result";

  const heading = document.createElement("h2");
  const link = document.createElement("a");
  link.href = result.url;
  link.textContent = result.meta.title || result.url;
  heading.append(link);

  const excerpt = document.createElement("p");
  excerpt.className = "search-excerpt";
  excerpt.innerHTML = result.excerpt;

  const path = document.createElement("p");
  path.className = "search-path";
  path.textContent = new URL(result.url, document.baseURI).pathname;

  item.append(heading, excerpt, path);
  return item;
}

async function runSearch() {
  const term = input.value.trim();
  const area = areaSelect.value;

  if (!term) {
    clearResults();
    status.textContent = "検索する言葉を入力してください。";
    return;
  }

  submitButton.disabled = true;
  status.textContent = "検索しています…";

  try {
    const options = area ? { filters: { area } } : {};
    const search = await pagefind.search(term, options);
    const loadedResults = await Promise.all(
      search.results.slice(0, 20).map((result) => result.data())
    );

    clearResults();
    for (const result of loadedResults) {
      results.append(createResultItem(result));
    }

    const scope = area || "サイト全体";
    status.textContent = `「${term}」の検索結果：${search.results.length}件（${scope}）`;

    if (search.results.length === 0) {
      const message = document.createElement("p");
      message.className = "search-empty";
      message.textContent = "別の言葉を試すか、検索する地域を変更してください。";
      results.append(message);
    }
  } catch (error) {
    console.error(error);
    clearResults();
    status.textContent = "検索中にエラーが発生しました。ページを再読み込みしてください。";
  } finally {
    submitButton.disabled = false;
  }
}

async function initializeSearch() {
  try {
    const pagefindUrl = new URL("./pagefind/pagefind.js", document.baseURI);
    pagefind = await import(pagefindUrl.href);

    const siteBase = new URL(".", document.baseURI).pathname;
    await pagefind.options({
      baseUrl: siteBase,
      excerptLength: 24
    });
    await pagefind.init();

    const availableFilters = await pagefind.filters();
    const areaCounts = availableFilters.area || {};
    for (const option of areaSelect.options) {
      if (option.value && areaCounts[option.value] !== undefined) {
        option.textContent = `${option.dataset.label}（${areaCounts[option.value]}ページ）`;
      }
    }

    submitButton.disabled = false;
    status.textContent = "検索する言葉と地域を指定してください。";
  } catch (error) {
    console.error(error);
    status.textContent = "検索用データを読み込めませんでした。";
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  runSearch();
});

areaSelect.addEventListener("change", () => {
  if (input.value.trim()) {
    runSearch();
  }
});

initializeSearch();
