/**
 * @author  reetsee.com
 * @date    20160925
 */
import React from "react";

export let WeiboAuthorizeCallbackPage = React.createClass({
    getInitialState: function() {
        return {};
    },
    render: function() {
        return (
            <div>
                <span>
                    {window.location.href}
                </span>
            </div>
        );
    },
});
