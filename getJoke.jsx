/* jshint esversion: 11 */
const Categories = ({ items, onCategoryChange }) => {
  const { Button } = ReactBootstrap;
  if (items.length <= 1) return null;

  let num = items.length;
  const list = items.map(category => {
    return (
      <Button key={category.name} onClick={onCategoryChange} className="page-item">
        {category.name}
      </Button>
    );
  });
  return (
    <nav>
      <ul className="pagination">{list}</ul>
    </nav>
  );
};

function App() {
  const { Container } = ReactBootstrap;
  const { useState, useEffect } = React;
  const [data, setData] = useState("Joke of the data");
  const [isError, setIsError] = useState(false);
  const [jodCategory, setJodCategory] = useState("blonde");
  const [jodCategories, setJodCategories] = useState([]);
  const [url, setUrl] = useState("https://api.jokes.one/jod?category=blonde");
  const [isLoading, setIsLoading] = React.useState(false);

  console.log("Rendering App");

  const handleCategoryChange = e => {
    setJodCategory(e.target.innerText);
    setUrl(`https://api.jokes.one/jod?category=${jodCategory}`);
  }

  useEffect(() => {   // Handles the LifeCycle Events
    console.log("Fetching data...");

    function get_joke_of_the_day() {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Access the result here
            const dataobj = JSON.parse(this.responseText);
            const { contents: {jokes}} = dataobj;
            
            setData(jokes[0].joke.text);
        }; // readyState
      }; // onreadystatechange
      xhttp.open("GET", url, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.setRequestHeader("X-JokesOne-Api-Secret", "YOUR API HERE");
      xhttp.send();
    };

    function get_joke_categories() {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Access the result here
            const dataobj = JSON.parse(this.responseText);
            const { contents: {categories}} = dataobj;
            
            setJodCategories(categories);
        }; // readyState
      }; // onreadystatechange
      xhttp.open("GET", "https://api.jokes.one/jod/categories", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.setRequestHeader("X-JokesOne-Api-Secret", "YOUR API HERE");
      xhttp.send();
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        //const result = await axios(url);
        get_joke_of_the_day();
        get_joke_categories();
        // setData(result.data);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [url], [jodCategory]);
  return (
    <Container>
      {isError && <div>Something went wrong ...</div>}
      <Categories
        items={jodCategories}
        onCategoryChange={handleCategoryChange}
      ></Categories>

      {isLoading ? (
        <div>Loading ...</div>
      ) : (<div>
          {data}
          </div>
      )}
    </Container>
  );
}
// ========================================
ReactDOM.render(<App />, document.getElementById("root"));
