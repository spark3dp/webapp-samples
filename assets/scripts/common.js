var common = function ($) {
    'use strict';


    var shortMonth = function (month) {
        var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return shortMonths[month];
    };

    return {

        /**
         * Loads ajax loader whenever we want
         * @param elem - any jquery selector
         */
        loadAjaxLogger: function (elem) {
            $(elem).load("plugins/ajaxlogger/loggers.html");
        },

        /**
         * UI stuff
         */
        setUIFunctionality: function () {

            //set listener to tooltip hover
            $('.with_hover').hover(
                function () {
                    $(this).next('.stooltip').find('span').show();
                },
                function () {
                    $(this).next('.stooltip').find('span').hide();
                }
            );

            //set listener to input focus to remove errors
            $('#asset-form').on('keyup', '.error', function () {
                if ($(this).val().length > 0) {
                    $(this).next('.field_error').addClass('hidden');
                }
            });

            //set listener to input focus to remove errors
            $('.sample-app-form').on('keyup', '.error', function () {
                if ($(this).val().length > 0) {
                    $(this).next('.field_error').addClass('hidden');
                }
            });

            //set listener to input focus to remove errors
            $('.sample-app-form').on('change', '.error', function () {
                if ($(this).val().length > 0) {
                    $(this).next('.field_error').addClass('hidden');
                }
            });

            //checkboxes
            //$('.chk')

        },
        /**
         * Validates input and sets proper errors
         */
        validateInput: function (elem) {

            if (elem.val().length) {
                $('.error').removeClass('error');
                $('.error').next('.field_error').addClass('hidden');
                return true;
            } else {
                elem.addClass('error');
                elem.next('.field_error').removeClass('hidden');
                return false;
            }

        },

        /**
         *  Adjsut string length to desired length
         */
        maxLength: function (input, desiredLength, hidePoints) {
            if (input.length <= desiredLength) {
                return input;
            } else {
                return input.substring(0, desiredLength) + (!hidePoints ? '...' : '');
            }
        },

        /**
         * Return date in the format mm-dd-yyyy
         * @param {Date} myDate - The Date object
         * @returns {string} - Formatted date
         */
        formatDate: function (myDate) {
            var yyyy = myDate.getFullYear().toString();
            var mm = (myDate.getMonth() + 1).toString(); // getMonth() is zero-based
            var dd = myDate.getDate().toString();
            return (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]) + '-' + yyyy;
        },
        formatDateHuman: function (myDateString) {
            var myDate = new Date(myDateString);
            var day = myDate.getDate().toString(),
                month = shortMonth(myDate.getMonth()),
                yyyy = myDate.getFullYear().toString();

            return month + ' ' + day + ', ' + yyyy;
        },
        jsonToParams: function (jsonObj) {
            var str = '';
            for (var key in jsonObj) {
                str += key + '=' + jsonObj[key] + '&';
            }

            return str;
        },
        /**
         * @description - Transform parameter strings to array of params
         * @param {String} prmstr - The GET query string
         * @returns {Object} - Associative array of parameters
         */
        transformToAssocArray: function (prmstr) {
            var params = {};

            if (prmstr) {
                var prmarr = prmstr.split('&');
                for (var i = 0; i < prmarr.length; i++) {
                    var tmparr = prmarr[i].split('=');
                    params[tmparr[0]] = tmparr[1];
                }
            }

            return params;
        },

        /**
         * @description - Extract params from URL
         * @param {String} prmstr - The GET query string
         * @returns {Object} - URL parameters
         */
        extractParamsFromURL: function (prmstr) {
            prmstr = prmstr || window.location.search.substr(1) || window.location.hash.substr(1);

            return prmstr ? this.transformToAssocArray(prmstr) : {};
        },

        /**
         * Run some stuff as soon as everyting loads
         */
        runOnLoad: function () {

            //open the sample in a new window
            $('.sample-app-header').find('.si-popup-icon').on('click', function (e) {
                e.preventDefault();
                var w = $('#container').width() + 30,
                    h = 700,
                    left = (screen.width / 2) - (w / 2),
                    top = (screen.height / 3) - (h / 3);
                window.open(window.location.href + '?popup=true', '_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=1, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
            });

            //remove open in new window button inside an opened window
            if (this.extractParamsFromURL().popup) {
                $('.sample-app-header').find('.si-popup-icon').remove();
            }
        }

    };

}(jQuery);

//run some basic stuff
common.runOnLoad();

//file size to human readable
Object.defineProperty(Number.prototype, 'fileSize', {
    value: function (a, b, c, d) {
        return (a = a ? [1e3, 'k', 'B'] : [1024, 'K', 'iB'], b = Math, c = b.log,
                d = c(this) / c(a[0]) | 0, this / b.pow(a[0], d)).toFixed(0)
            + '' + (d ? (a[1] + 'MGTPEZY')[--d] + a[2] : 'Bytes');
    }, writable: false, enumerable: false
});