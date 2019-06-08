# Restaurant Order Management Web App
Built with VueJS, socket-io, and tailwindcss

# Steps to run project

## 1. Get Mapbox API key and add to .env file like so
In the .env file, replace `YOUR_ACCESS_TOKEN` with your mapbox access token, which you can create for free at mapbox.com.

**Order Detail view will not show a map view if you don't have this setup.**
```
VUE_APP_MAPBOX_ACCESS_TOKEN=MAPBOX_ACCESS_TOKEN
```

## 2. Install Dependencies
```
npm install
```

## 3. Run simulation
```
npm run simulation
```

# Screenshots
Notifications
![Notifcations](/screenshots/Notifications.png?raw=true)

Order Detail
![Order Detail](/screenshots/OrderDetail.png?raw=true)

Take manual action on an order
![Order Detail](/screenshots/OrderDetail_DropDown.png?raw=true)

Filtered order view
![Filtered order view](/screenshots/FilteredOrders.png?raw=true)

Restaurant Performance
Take manual action on an order
![Restaurant performance](/screenshots/Performance_Data.png?raw=true)

# Design Decisions
BE send the following payload signature for order events:
```
{
  destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
  event_name: "CREATED",
  id: "4b76edbf",
  name: "Cheese pizza",
  sent_at_second: 4
},
```

Order events are stored in a global state container (following flux design pattern, specifically using Vuex (Vue's flux library). I chose to listen to socket-io events npm package `vue-socket.io` which sets up a mutation that is listened for and processes the event. The FE listens for each new event and stores the following:
```
{
  destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
  event_name: "CREATED",
  id: "4b76edbf",
  name: "Cheese pizza",
  sent_at_second: 4,

  currentStatus: // new event status,
  events: {
    EVENT_NAME: { new_event payload }
  }
},

```
- I chose to store each new event as a new event name in `events` (instead of an array). This gives me instant access O(1) access to whichever order event I'm looking for. Example if I want to know when an event was delivered, I can simply do `order.events.DELIVERED` directly in any component without having to lookup within an array of events. The one downside of this approach is we don't keep a good log of all events in the _order_ in which they are received. However, I do store the `sent_at_second` even when a user manually updates an order, so I *could* stitch together the order history in the correct order if such a request was made by Product & Design :) But at that point I would push for us to add a new api endpoint that fetches order history bc we do not need the entire order history in most views only in OrderDetails view.
 
# If I had more time!
- update BE to send minimal payloads when order status changes, all we need on FE is the `id` and `event_name` on a new status order. Right now we receive the entire `order` {}.
- add better animations when order status' change
- show full order history (see discussion above)
  - right now I assume most orders will transition between these 5 statuses: CREATED -> COOKED -> DRIVER_RECEIVED -> DELIVERED (with the option of it becoming CANCELLED at any point)
- show in the dashboard at which point are orders being CANCELLED, if they've already been cooked or are en route, the restaurant is bleeding money, this is valuable information for restaurant owners to know.


# Tests

### Run your tests
```
npm run test
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Run your unit tests
```
npm run test:unit
```