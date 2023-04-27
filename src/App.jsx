import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  return (
    <>
      <div className="container">
        <div className="card">
          <div className="card-body">
            <form>
              <label htmlFor="address">Enter your address:</label>
              <div className="mb-3">
                <input type="text" name="address" className="form-control" id="address" placeholder="123 rd..." />
              </div>
              <button type="submit" className="btn btn-outline-dark">
                Find closest locations
              </button>
            </form>
          </div>
        </div>
      </div>
      <div id="results"></div>
    </>
  );
}

export default App;
