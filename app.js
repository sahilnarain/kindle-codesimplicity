var async = require('async');
var request = require('request');
var feed = require('feed-read');
var epub = require('epub-gen');

var feedUrl = 'http://www.codesimplicity.com/feed';
var content = [];

module.exports.today = function () {
  feed(feedUrl, function (err, result) {
    if (err) {
      console.log(err);
      process.exit(0);
    }

    var cutoff = new Date().setHours(0, 0, 0, 0);
    var bookData = {};
    var links = [];

    bookData.title = new Date().toISOString().substring(0, 10) + ' - Code Simplicity Blog';
    bookData.author = 'Max Kanat-Alexander';
    bookData.publisher = 'Sahil';
    bookData.content = [];

    for (i = 0; i < result.length; i++) {
      if (result[i].published > cutoff) {
        links.push(process.ENV.PARSER_ARTICLE + '?api_key=' + process.env.PARSER_KEY + '&url=' + result[i].link);
      }
    }
  });
};

module.exports.today = function () {
  var links = [];
  async.waterfall([

    function (doneCallback) {
      feed(feedUrl, function (err, result) {
        if (err) {
          return doneCallback(err);
        }

        return doneCallback(null, result);
      });
    },
    function (rss, doneCallback) {
      var cutoff = new Date().setHours(0, 0, 0, 0);

      for (i = 0; i < rss.length; i++) {
        if (rss[i].published > cutoff) {
          links.push(rss[i].link);
        }
      }

      return doneCallback(null, links);
    },
    function (links, doneCallback) {
      async.eachSeries(links, function (link, cb) {
        var options = {
          method: 'GET',
          url: link
        };

        request(options, function (err, response, body) {
          body = JSON.parse(body);
          var chapter = {
            title: body.title,
            author: body.author,
            content: body.html
          }
        });
      }, function (err) {
        if (err) {
          return doneCallback(err);
        }

        return doneCallback(null);
      });
    },
  ], function (err, result) {
    if (err) {
      console.log(err);
      process.exit(0);
    }

    console.log(result);
    process.exit(1);
  });
};

module.exports.archive = function () {
  var links = [process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/welcome-to-code-simplicity/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/whats-wrong-with-computers/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/designing-too-far-into-the-future/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/simplicity-is-relative/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/purpose-and-simplicity/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/complexity-is-a-prison/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/how-simple-do-you-have-to-be/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/what-is-overengineering/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/ways-to-create-complexity-break-your-api/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/when-is-backwards-compatibility-not-worth-it/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/simplicity-and-strictness/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/there-is-no-science-of-software/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/the-primary-law-of-software-design/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/what-is-software-design/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/the-purpose-of-software/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/the-goals-of-software-design/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/the-second-law-of-software-design/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/the-third-law-of-software-design/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/the-fourth-law-of-software-design-complexity-vs-ease-of-maintenance/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/if-it-aint-broken/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/instant-gratification-instant-failure/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/truncated-posts-in-rss/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/complexity-and-the-wrong-solution/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/specific-solutions/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/the-never-shipping-product/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/fosscoach-2008/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/unforseeable-consequences-why-we-have-principles/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/creating-complexity-lock-in-to-bad-technologies/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/what-is-a-bug/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/the-source-of-bugs/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/talking-at-oscon/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/slides-from-my-talk/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/sane-software-design/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/design-from-the-start/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/designing-for-perfomance-and-the-future-of-computing/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/success-comes-from-execution-not-innovation/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/top-10-reasons-to-work-on-open-source-in-a-california-accent/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/what-is-a-computer/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/simplicity-and-security/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/structure-action-and-results/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/isar-clarified/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/features-simplicity-and-the-purpose-of-software/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/consistency-does-not-mean-uniformity/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/suck-less/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/how-we-figured-out-what-sucked/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/the-engineer-attitude/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/the-singular-secret-of-the-rockstar-programmer/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/why-programmers-suck/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/privacy-simplified/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/the-equation-of-software-design/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/software-design-in-two-sentence/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/before-you-begin/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/the-power-of-no/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/readability-and-naming-things/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/open-source-community-simplified/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/developer-hubris/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/clues-to-complexity/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/code-simplicity-the-science-of-software-development/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/software-as-knowledge/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/code-simplicity-second-revision/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/the-accuracy-of-future-predictions/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/users-have-problems-developers-have-solutions/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/the-philosophy-of-testing/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/make-it-never-come-back/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/the-secret-of-fast-programming-stop-thinking/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/the-purpose-of-technology/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/test-driven-development-and-the-cycle-of-observation/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/how-to-handle-code-complexity/',
    process.ENV.PARSER_ARTICLE + '?api_key=' + process.ENV.PARSER_KEY + '&url=http://www.codesimplicity.com/post/two-is-too-many/'
  ];

  async.eachSeries(links, function (link, cb) {
    setTimeout(function () {
      var options = {
        method: 'GET',
        url: link
      };

      request(options, function (err, response, body) {
        body = JSON.parse(body);
        console.log('Downloading - ' + body.title);
        content.push(body);
        return cb(null);
      });
    }, 1000);
  }, function (err) {
    if (err) {
      console.log('Error');
      console.log(err);
    }

    var bookData = {};
    bookData.title = 'Code Simplicity Blogs';
    bookData.author = 'Max Kanat-Alexander';
    bookData.publisher = 'Sahil';
    bookData.content = [];

    var i = 0;
    async.eachSeries(content, function (con, cb) {
      var chapter = {
        title: con.title,
        author: 'Max Kanat-Alexander',
        data: con.html
      };
      bookData.content.push(chapter);
      return cb(null);
    }, function (err) {
      if (err) {
        console.log(err);
      }

      new epub(bookData, __dirname + '/CodeSimplicity.epub');
      console.log('Done');
    });
  });
};