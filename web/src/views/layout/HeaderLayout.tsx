import {Header} from "antd/es/layout/layout";
import {Col, Dropdown, Menu, Row} from "antd";
import "../../App.css";
import "./layout.css"
import {NavLink} from "react-router-dom";
import logo from "../../assets/images/logo-dark.png";
import React from "react";
import {CaretDownOutlined} from "@ant-design/icons";


const HeaderLayout = (props: any) => {
    const {hideConsole} = props
    const menu = (
        <Menu>
            <Menu.Item>退出登录</Menu.Item>
        </Menu>
    )
    const assets = (
        <Menu style={{width: "100px"}}>
            <Menu.Item>资产1</Menu.Item>
            <Menu.Item>资产2</Menu.Item>
            <Menu.Item>资产3</Menu.Item>
        </Menu>
    )

    return <Header className="ts-header">
        <Row justify="space-around">
            <Col span={2}>
                <img src={logo} width={100} alt="ThetaSensors"/>
            </Col>
            <Col span={4} className="ts-title">云监控平台</Col>
            <Col span={10}/>
            <Col span={2}>
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#!" onClick={e => e.preventDefault()}>
                        {/*{store.getState().auth.data.user.username}*/}
                    </a>
                </Dropdown>
            </Col>
            <Col span={2} hidden={hideConsole}>
                <Dropdown arrow overlay={assets} trigger={['click']} placement="bottomCenter" className="ts-menu">
                    <a href="#!" onClick={e => e.preventDefault()}>
                        资产 <CaretDownOutlined />
                    </a>
                </Dropdown>
            </Col>
            <Col span={2} hidden={hideConsole}>
                <NavLink to="/device-management/devices" className="ts-menu">控制台</NavLink>
            </Col>
        </Row>
    </Header>
}

export default HeaderLayout