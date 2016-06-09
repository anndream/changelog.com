import "phoenix_html"
import channelView from "./admin/views/channelView"
import episodeView from "./admin/views/episodeView"
import podcastView from "./admin/views/podcastView"
import postView from "./admin/views/postView"

let views = {
  "ChannelView": channelView,
  "PodcastView": podcastView,
  "EpisodeView": episodeView,
  "PostView": postView
}

let timeString = function(date) {
  let month = date.getMonth() + 1;
  let year = date.getFullYear().toString().substr(2, 2);
  let day = date.getDate();
  let hours = date.getHours();
  let amPm = "AM";
  let tz =  date.toString().match(/\(([\w\s]+)\)/)[0];

  if (hours > 12) {
    hours = hours - 12;
    amPm = "PM";
  }

  let minutes = date.getMinutes();

  if (minutes == 0) {
    minutes = "";
  } else if (minutes < 10) {
    minutes = `:0${minutes}`;
  } else {
    minutes = `:${minutes}`;
  }

  return `${month}/${year}/${day} – ${hours}${minutes}${amPm} ${tz}`;
}

$("#sidebar").sidebar({context: $("#main")});
$("a[rel=external]").attr("target", "_blank");
$("input[readonly]").popup({
  content: "Read-only because danger. Use the console if you really need to edit this.",
  variation: "very wide"
});
$(".ui.dropdown").dropdown();
$(".ui.checkbox").checkbox();
$(".ui.button, [data-popup=true]").popup();

$("span.time").each(function() {
  let $span = $(this);
  let date = new Date($span.text());
  $span.text(timeString(date));
})

$(".ui.navigation.search").search({
  type: "category",
  minCharacters: 3,
  apiSettings: {
    url: "/admin/search?q={query}&f=json"
  },
  onSelect: function(result, response) {
    console.log("FAIL", result["url"]);
    return false;
  }
})

let $body = $("body");
let viewName = $body.data("module").match(/\.(\w+View)$/)[1];
let actionName = $body.data("template").replace(".html", "");

let viewClass = views[viewName];

if (viewClass !== undefined) {
  let activeView = new viewClass();

  if ($.isFunction(activeView.shared))
    activeController.shared();

  if ($.isFunction(activeView[actionName]))
    activeView[actionName]();
}
