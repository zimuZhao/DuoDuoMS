(function ($) {

    $.fn.table = function (options) {
        var defaults = {
            state: "data",
            pageNum: 1,
            currentPage: 1,
            jumpTo: function () {
            }
        };

        var opts = $.extend(defaults, options);

        return this.each(function () {

            var $this = $(this);

            if (opts.state == "data") {
                if (this.tagName == "TABLE" && opts.pageNum > 0 && opts.currentPage >= 0 && opts.pageNum > opts.currentPage) {
                    var $pagination = $this.find("tfoot .pagination");
                    var $previous = $pagination.find(".previous");
                    var $page = $pagination.find(".page:eq(0)").clone(true);
                    var $next = $pagination.find(".next").clone(true);
                    var $newPage = $page.clone(true);
                    $pagination.html("");
                    $pagination.closest("td").attr("colspan", $this.find("thead").find("td").length);
                    $pagination.append($previous);
                    if (opts.pageNum <= 7) {
                        for (var i = 1; i <= opts.pageNum; i++) {
                            $newPage = $page.clone(true);
                            $newPage.find("a").html(i);
                            $pagination.append($newPage);
                        }
                    } else {
                        if (opts.currentPage < 4) {
                            for (var i = 1; i <= 5; i++) {
                                $newPage = $page.clone(true);
                                $newPage.find("a").html(i);
                                $pagination.append($newPage);
                            }
                            $newPage = $page.clone(true);
                            $newPage.find("a").html("…");
                            $pagination.append($newPage);
                            $newPage = $page.clone(true);
                            $newPage.find("a").html(opts.pageNum);
                            $pagination.append($newPage);
                        } else if ((opts.pageNum - opts.currentPage) < 5) {
                            $newPage = $page.clone(true);
                            $newPage.find("a").html("1");
                            $pagination.append($newPage);
                            $newPage = $page.clone(true);
                            $newPage.find("a").html("…");
                            $pagination.append($newPage);
                            for (var i = opts.pageNum - 4; i <= opts.pageNum; i++) {
                                $newPage = $page.clone(true);
                                $newPage.find("a").html(i);
                                $pagination.append($newPage);
                            }
                        } else {
                            $newPage = $page.clone(true);
                            $newPage.find("a").html("1");
                            $pagination.append($newPage);
                            $newPage = $page.clone(true);
                            $newPage.find("a").html("…");
                            $pagination.append($newPage);
                            $newPage = $page.clone(true);
                            $newPage.find("a").html(opts.currentPage);
                            $pagination.append($newPage);
                            $newPage = $page.clone(true);
                            $newPage.find("a").html(opts.currentPage + 1);
                            $pagination.append($newPage);
                            $newPage = $page.clone(true);
                            $newPage.find("a").html(opts.currentPage + 2);
                            $pagination.append($newPage);
                            $newPage = $page.clone(true);
                            $newPage.find("a").html("…");
                            $pagination.append($newPage);
                            $newPage = $page.clone(true);
                            $newPage.find("a").html(opts.pageNum);
                            $pagination.append($newPage);
                        }
                    }
                    $pagination.append($next);
                    $pagination.find(".page").each(function (index, item) {
                        var $item = $(item);
                        $item.removeClass($pagination.attr("disabled"));
                        $item.removeClass($pagination.attr("active"));
                        $item.unbind("click");
                        if (opts.currentPage + 1 == $item.find("a").html()) {
                            $item.addClass($pagination.attr("active"));
                        } else if ("…" == $item.find("a").html()) {
                            $item.addClass($pagination.attr("disabled"));
                        } else {
                            $item.bind('click', function () {
                                opts.jumpTo($item.find("a").html() - 1);
                            });
                        }
                    });
                    $pagination.find(".previous").unbind("click");
                    $pagination.find(".next").unbind("click");
                    if (opts.currentPage == 0) {
                        $pagination.find(".previous").addClass($pagination.attr("disabled"));
                    } else {
                        $pagination.find(".previous").removeClass($pagination.attr("disabled"));
                        $pagination.find(".previous").bind('click', function () {
                            opts.jumpTo(opts.currentPage - 1);
                        });
                    }
                    if (opts.currentPage + 1 == opts.pageNum) {
                        $pagination.find(".next").addClass($pagination.attr("disabled"));
                    } else {
                        $pagination.find(".next").removeClass($pagination.attr("disabled"));
                        $pagination.find(".next").bind('click', function () {
                            opts.jumpTo(opts.currentPage + 1);
                        });
                    }
                    $this.find("tfoot").removeClass("hidden");
                }
            }

            /*if (methods[method]) {
             methods[method].apply(this, Array.prototype.slice.call(
             arguments, 1));
             } else if (typeof method === 'object' || !method) {
             methods.init.apply(this, arguments);
             } else {
             $.error('Method ' + method
             + ' does not exist on jQuery.tooltip');
             }*/

        });

    };
})(jQuery);