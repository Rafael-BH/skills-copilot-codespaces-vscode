// Create web server application
// Run with: node comments.js
// ==============================================

// Import modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// Create server
http.createServer(function (request, response) {
    // Get path
    var path = url.parse(request.url).pathname;
    
    // Get query
    var query = url.parse(request.url).query;
    
    // Get query parameters
    var parameters = qs.parse(query);
    
    // Get method
    var method = request.method;
    
    // Get comments
    var comments = fs.readFileSync('comments.txt', 'utf8');
    
    // Output HTML
    response.writeHead(200, {'Content-Type': 'text/html'});
    
    // Handle path
    if (path == '/') {
        // Output form
        response.write('<html><body>');
        response.write('<form method="post" action="/submit">');
        response.write('Name: <input type="text" name="name"><br>');
        response.write('Comment: <textarea name="comment"></textarea><br>');
        response.write('<input type="submit" value="Submit">');
        response.write('</form>');
        
        // Output comments
        response.write('<p>Comments:</p>');
        response.write('<ul>');
        var lines = comments.split('\n');
        for (var i = 0; i < lines.length; i++) {
            response.write('<li>' + lines[i] + '</li>');
        }
        response.write('</ul>');
        
        // Output footer
        response.write('</body></html>');
        response.end();
    } else if (path == '/submit') {
        if (method == 'POST') {
            // Handle POST
            var body = '';
            request.on('data', function (data) {
                body += data;
            });
            request.on('end', function () {
                // Store comment
                var comment = qs.parse(body);
                fs.appendFileSync('comments.txt', comment.name + ': ' + comment.comment + '\n');
                
                // Redirect to home
                response.writeHead(302, {'Location': '/'});
                response.end();
            });
        } else {
            // Handle GET
            response.writeHead(405, {'Content-Type': 'text/html'});
            response.write('<html><body>');
            response.write('<p>405 Method Not Allowed</