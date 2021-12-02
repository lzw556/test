import { Header } from "antd/es/layout/layout";
import { Button, Col, Dropdown, Menu, Row, Space, Typography } from "antd";
import "../../App.css";
import "./layout.css"
import "../../assets/iconfont.css"
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo-dark.png";
import {CreditCardOutlined, DashboardOutlined, UserOutlined} from "@ant-design/icons";
import { persistor, store } from "../../store";
import {useState} from "react";
import moment from "moment";

const { Text } = Typography;

const HeaderLayout = (props: any) => {
    const { hideConsole } = props
    const [currentUser] = useState<any>(store.getState().auth.data.user)
    const [now, setNow] = useState<string>(moment().format("YYYY-MM-DD HH:mm:ss"))

    setInterval(() => {
        setNow(moment().format("YYYY-MM-DD HH:mm:ss"))
    }, 1000)

    const onLogout = () => {
        persistor.purge().then(_ => {
            window.location.reload()
        })
    }

    const menu = (
        <Menu onClick={onLogout}>
            <Menu.Item key={1}>退出登录</Menu.Item>
        </Menu>
    )

    return <Header className="ts-header">
        <Row justify="space-around">
            <Col span={6}>
                <Space className={"ts-title"}>
                    <img src={logo} width={100} alt="ThetaSensors" style={{ verticalAlign: "middle" }} />
                    云监控平台
                </Space>
            </Col>
            <Col span={8}/>
            <Col offset={2} span={4}>
                <Space>
                    <Text style={{color: "white"}} strong>{now}</Text>
                </Space>
            </Col>
            <Col span={2}>
                <Dropdown overlay={menu}>
                    <Space>
                        <Button type={"text"} style={{color:"#fff"}}><UserOutlined />{currentUser?.username}</Button>
                    </Space>
                </Dropdown>
            </Col>
            <Col span={2} hidden={hideConsole}>
                <Space>
                    <NavLink to="/device-management?locale=devices" className="ts-menu"><CreditCardOutlined /> 控制台</NavLink>
                </Space>
            </Col>
            <Col span={2} hidden={!hideConsole}>
                <Space>
                    <NavLink to="/dashboard" className="ts-menu"><DashboardOutlined /> 监控大屏</NavLink>
                </Space>
            </Col>
        </Row>
    </Header>
}

export default HeaderLayout