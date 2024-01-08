# The generator identifies all the URLs that need to be included in the sitemap. It creates a structured document following the XML format based on date present in event discovery database. Cron job must be run inorder to generate and crawl thorugh websites. This generator consumes scheduled SQSs to produce new sitemaps to S3 bucket.


