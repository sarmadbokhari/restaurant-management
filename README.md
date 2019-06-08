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
BE sends the following payload signature for each order:
```
{
  destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
  event_name: "CREATED",
  id: "4b76edbf",
  name: "Cheese pizza",
  sent_at_second: 4
},
```

Orders are stored in a global state container, following flux design patterns, specifically using Vuex. I chose to use npm package `vue-socket.io` to listen to socket-io events. I use `vue-socket.io` to listen for `new_event` emitted from socket-io at port 3000. `SOCKET_new_event` mutation processes the event.

On the FE I store orders like so:
```
{
  destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
  event_name: "CREATED",
  id: "4b76edbf",
  name: "Cheese pizza",
  sent_at_second: 4,

  currentStatus: String, // new event status,
  events: {
    EVENT_NAME: { new_event_payload }
  }
},

```
- Because there are only 5 possible `event_name` (`CREATED`, `COOKED`, `DRIVER_RECEIVED`, `DELIVERED`, and `CANCELLED`), I chose to store each new event in an `events {}` (instead of in an array). This gives me instant O(1) access to whichever order event I'm looking for. For example, if I want to know when an event was delivered, in any component I can simply do `order.events.DELIVERED` directly in any component without having to lookup within an array of events. The one downside of this approach is we don't keep a good log of all events in the _order_ in which they are received. However, I do store a `sent_at_second` property when a user manually updates an order, so we *could* stitch together the order history in the correct order if such a request was made by Product & Design :) But at that point I would push for us to add a new api endpoint that fetches order history because we do not need the entire order history in most views.
 


# If I had more time!
- Update BE to send minimal payloads when order status changes, all we need on FE is the `id` and `event_name` on a new status order, or if the order item itself is being changed we could simply send `{ id: ID, changes: { ... } }`. Right now we receive the entire `order` {}.
- Add better animations when order statuses change
- Show full order history (see discussion above)
  - Right now I assume most orders will transition between these 5 statuses: CREATED -> COOKED -> DRIVER_RECEIVED -> DELIVERED (with the option of it becoming CANCELLED at any point)
- Show in the dashboard at which point orders are being CANCELLED. If they've already been cooked or are en route, the restaurant is bleeding money, this is valuable information for restaurant owners to know.
- Add more tests, specifically testing various order status changes.
- Explore adding a FE state machine design pattern for each order.



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