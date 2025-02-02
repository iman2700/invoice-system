Install Docker & Docker Compose in root directory
 
docker-compose up --build
 

Builds the images for:
invoice-service (the NestJS API handling invoices, cron job, and publishing to RabbitMQ)
email-sender (the NestJS consumer listening on RabbitMQ to send emails)
Starts other essential containers:
MongoDB
RabbitMQ (with management UI)
By default:
invoice-service is available on port 3000.
email-sender is available on port 3001.
MongoDB on 27017.
RabbitMQ on 5672  

-Check Logs

To see logs from a specific service, for example invoice-service:
 
docker-compose logs -f invoice-task

-email:
 
docker-compose logs -f email-task

You should see something like: 
Received message: {"date":"2025-01-26","totalSales":100, "itemsSummary":[...]}
Daily sales report email sent successfully.
If there’s an error sending email, it will appear in these logs.

Note: in docker-compose change - EMAIL_TO=iman_2700@yahoo.com to your mail

-Access RabbitMQ Management
In your browser, go to http://localhost:15672.
Default credentials: guest / guest.

-Wait for Cron
 
To test quickly, you can temporarily change the cron schedule (in the code) 
to something like */1 * * * * (every minute) 

-Run Unit Tests
npm run test

-Run Integration or e2e Tests
npm run test:e2e

----------
swgger test
http://localhost:3000/api