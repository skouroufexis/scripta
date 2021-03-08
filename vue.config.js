const { debug } = require("console");

module.exports = {
    devServer: {
        
        proxy: {
          '^/api': {
            target: 'http://localhost:8000',            
            secure:false,

          }
        },
        
      }
  }
  