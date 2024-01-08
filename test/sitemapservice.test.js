const { expect } = require("chai");
const {
        convertStringToUrlFormat,
        getLastCrawledTime,
        createSitemap,
} = require("../src/services/sitemap.service");
const { sequelizeManager } = require("../src/managers");
const { EventModel, CategoryModel, SitemapModel } = sequelizeManager;
const { create } = require("xmlbuilder2");
// Convert String to URL format
describe("convertStringToUrlFormat function", () => {
        it("should convert a simple string to URL format", () => {
                const testData = "Hello World! This is a test";
                const expectedResult = "hello-world-this-is-a-test";

                const result = convertStringToUrlFormat({ data: testData });
                expect(result).to.equal(expectedResult);
        });

        it("should handle empty input", () => {
                const result = convertStringToUrlFormat({ data: "" });
                expect(result).to.equal("");
        });

        it("should handle special characters properly", () => {
                const testData = "Special $#! characters %like& @in^ string";
                const expectedResult = "special-characters-like-in-string";

                const result = convertStringToUrlFormat({ data: testData });
                expect(result).to.equal(expectedResult);
        });

        it("should handle non-alphanumeric characters at the beginning and end", () => {
                const testData =
                        " --- Testing non-alphanumeric characters at the beginning and end --- ";
                const expectedResult =
                        "testing-non-alphanumeric-characters-at-the-beginning-and-end";

                const result = convertStringToUrlFormat({ data: testData });
                expect(result).to.equal(expectedResult);
        });
});

// Get last Crawled Time
const findOneMock = (query) => {
        if (query.status === 1) {
                return Promise.resolve({
                        last_crawled_at: new Date("2023-01-01T00:00:00.000Z"),
                });
        }
        // Simulate not finding a record
        return Promise.resolve(null);
};

// Override the SitemapModel.findOne with the mock function
SitemapModel.findOne = findOneMock;

describe("getLastCrawledTime function", () => {
        it("should find the last crawled time for a given status", async () => {
                const expectedStatus = 1;
                const expectedTime = new Date("2023-01-01T00:00:00.000Z");
                const result = await getLastCrawledTime({ status: expectedStatus });
                expect(result).to.deep.equal({ last_crawled_at: expectedTime });
        });

        it("should handle not finding a last crawled time for a given status", async () => {
                const expectedStatus = 0;
                const result = await getLastCrawledTime({ status: expectedStatus });
                expect(result).to.be.null;
        });
});


const records = [{ id: 1, name: "Event One" }];
const lastCrawledAt = new Date("2023-01-01T00:00:00.000Z");
const root = create({ version: "1.0" }).ele("urlset", {
        xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
});
describe("createSitemap function", () => {
        it("should create a sitemap for EVENT type records", async () => {
                const result = await createSitemap({
                        records,
                        root,
                        last_crawled_at: lastCrawledAt,
                        type: 1,
                });
                // Note: Ensure the expected XML output exactly matches the generated XML structure
                // Constructing the expected XML structure using xmlbuilder2
                const expectedXML = create({ version: '1.0' })
                        .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' })
                        .ele('url')
                        .ele('loc')
                        .txt('https://yapsody.events/events/1-event-one')
                        .up()
                        .ele('lastmod')
                        .txt('2023-01-01T00:00:00.000Z')
                        .up()
                        .ele('changefreq')
                        .txt('weekly')
                        .up()
                        .ele('priority')
                        .txt('0.8')
                        .end();

                const resultXMLNormalized = result.toString().replace(/\s/g, '');
                const expectedXMLNormalized = expectedXML.toString().replace(/\s/g, '');

                expect(resultXMLNormalized).to.equal(expectedXMLNormalized);
        });

        it("should create a sitemap for CATEGORY type records", async () => {
                // Test similar to the EVENT type for CATEGORY type records
                const results = await createSitemap({
                        records,
                        root,
                        last_crawled_at: lastCrawledAt,
                        type: 2,
                });
                const expectedResult = `<?xmlversion="1.0"?><urlsetxmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://yapsody.events/events/1-event-one</loc><lastmod>2023-01-01T00:00:00.000Z</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url><url><loc>https://yapsody.events/?category/1</loc><lastmod>2023-01-01T00:00:00.000Z</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url></urlset>`;
                const resultXMLNormalize = results.toString().replace(/\s/g, '');
                const expectedXMLNormalize = expectedResult.toString().replace(/\s/g, '');

                expect(resultXMLNormalize).to.equal(expectedXMLNormalize);
        });

        it("should create a sitemap for other types of records", async () => {
                // Test similar to the EVENT type for other types of records
                const results = await createSitemap({
                        records,
                        root,
                        last_crawled_at: lastCrawledAt,
                        type: 2,
                });
                const expectedResult = `<?xmlversion="1.0"?><urlsetxmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://yapsody.events/events/1-event-one</loc><lastmod>2023-01-01T00:00:00.000Z</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url><url><loc>https://yapsody.events/?category/1</loc><lastmod>2023-01-01T00:00:00.000Z</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url><url><loc>https://yapsody.events/?category/1</loc><lastmod>2023-01-01T00:00:00.000Z</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url></urlset>`
                const resultXMLNormalize = results.toString().replace(/\s/g, '');
                const expectedXMLNormalize = expectedResult.toString().replace(/\s/g, '');

                expect(resultXMLNormalize).to.equal(expectedXMLNormalize);
        });
});
