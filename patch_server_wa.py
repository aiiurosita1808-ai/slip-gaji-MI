import re

with open("server.ts", "r") as f:
    c = f.read()

new_endpoint = """  app.post('/api/send-wa', async (req, res) => {
    try {
      const { target, message, schedule, token } = req.body;
      
      if (!target || !message || !token) {
        return res.status(400).json({ status: false, reason: 'Missing required fields' });
      }

      const formData = new FormData();
      formData.append('target', target);
      formData.append('message', message);
      if (schedule) {
        formData.append('schedule', schedule);
      }

      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': token,
        },
        body: formData
      });

      const responseData = await response.text();
      res.status(response.status).send(responseData);
    } catch (error: any) {
      console.error('Error sending WA:', error);
      res.status(500).json({ status: false, reason: error.message });
    }
  });

  // Vite middleware for development"""

c = c.replace("  // Vite middleware for development", new_endpoint)

with open("server.ts", "w") as f:
    f.write(c)
