const event = require('./event.model');
const artist = require('./artist.model');
const category = require('./category.model');
const location = require('./location.model');
const ticketOffer = require('./ticket-offer.model');
const organizer = require('./organizer.model');
const eventArtistMap = require('./event-artist-map.model');
const eventOrganizerMap = require('./event-organizer-map.model');
const sitemap = require('./sitemap.model');
const sitemapEventMap = require('./sitemap-event-map.model');
const promotion = require('./promotion.model');

module.exports = {
  event,
  artist,
  category,
  location,
  ticketOffer,
  organizer,
  eventArtistMap,
  eventOrganizerMap,
  sitemap,
  sitemapEventMap,
  promotion,
};
