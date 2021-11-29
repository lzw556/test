import {Button, Result} from "antd";
import React from "react";

const UnauthorizedPage = () => {
    return <Result
        status="403"
        title="403"
        subTitle="对不起，你没有权限访问该页面，请联系管理员"
        extra={
            <Button type="primary" onClick={() => {
                window.location.hash = "/dashboard"
            }}>返回首页</Button>
        }
    />
};

export default UnauthorizedPage;