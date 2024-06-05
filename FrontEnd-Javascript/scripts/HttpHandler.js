class HttpHandler {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

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
