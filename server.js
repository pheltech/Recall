const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// Load environment variables from .env
require('dotenv').config();

console.log('Supabase URL:', process.env.SUPABASE_URL); // Debugging line
console.log('Supabase Key:', process.env.SUPABASE_KEY); // Debugging line

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key is not defined in .env file');
}
const supabase = createClient(supabaseUrl, supabaseKey);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define an endpoint to fetch data from Supabase
app.get('/api/addresses', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
