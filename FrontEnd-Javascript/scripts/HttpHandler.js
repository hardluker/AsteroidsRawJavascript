class HttpHandler {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // This Function is for querying the entire high-score database
  async getAllHighScores() {
    try {
      const response = await fetch(`${this.baseURL}/api/high-scores`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch high scores:', error);
    }
  }

  // This Function is for getting a specific high-score by primary key
  async getHighScoreById(id) {
    try {
      const response = await fetch(`${this.baseURL}/api/high-scores/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to fetch high score with id ${id}:`, error);
    }
  }

  // This is the function for adding a high-score to the database
  async addHighScore(initials, score) {
    try {
      const response = await fetch(`${this.baseURL}/api/high-scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ initials, score })
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to add high score:', error);
    }
  }

  // This is the function for updating a high score of a specific primary key
  async updateHighScore(id, initials, score) {
    try {
      const response = await fetch(`${this.baseURL}/api/high-scores/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ initials, score })
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to update high score with id ${id}:`, error);
    }
  }

  // This is the function for deleting a high score from the database.
  async deleteHighScore(id) {
    try {
      const response = await fetch(`${this.baseURL}/api/high-scores/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return `High score with id ${id} deleted successfully`;
    } catch (error) {
      console.error(`Failed to delete high score with id ${id}:`, error);
    }
  }
}

export default HttpHandler;
