import {Button, Drawer, DrawerProps, Space, Tree} from "antd";
import {Role} from "../../../types/role";
import {FC, useEffect, useState} from "react";
import {GetPermissionsWithGroupRequest} from "../../../apis/permission";
import {AllocPermissionsRequest} from "../../../apis/role";

export interface PermissionDrawerProps extends DrawerProps {
    role?: Role
    onCancel: () => void
}

const PermissionDrawer: FC<PermissionDrawerProps> = (props) => {
    const {role, visible, onCancel} = props;
    const [permissions, setPermissions] = useState<any>();
    const [checkPermissions, setCheckPermissions] = useState<number[]>([]);

    useEffect(() => {
        if (role) {
            GetPermissionsWithGroupRequest().then(res => {
                if (res.code === 200) {
                    setPermissions(res.data)
                    console.log(res.data)
                }
            })
        } else {
            onCancel()
        }
    }, [role])

    const onSave = () => {
        if (role) {
            AllocPermissionsRequest(role.id, checkPermissions).then(_ => {
                onCancel()
            })
        }
    }

    const renderDefaultCheckedKeys = () => {
        if (role) {
            const ps = role.permissions.map((item: any) => `${item[0]}::${item[1]}`)
            const checked: any[] = []
            Object.keys(permissions).forEach(key => {
                permissions[key].filter((item: any) => {
                    return ps.includes(`${item.path}::${item.method}`)
                }).forEach((item: any) => {
                    checked.push(item.id)
                })
            })
            return checked
        }
        return []
    }

    const renderExtra = () => {
        return <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button type={"primary"} onClick={onSave}>保存</Button>
        </Space>
    }

    const onCheck = (checkKeys: any, e: any) => {
        setCheckPermissions(checkKeys)
    }

    const convertTreeData = () => {
        const treeData: any[] = [];
        Object.keys(permissions).forEach(key => {
            treeData.push({
                title: key,
                key: key,
                checkable: false,
                children: permissions[key].map((item: any) => {
                    return {
                        title: item.description,
                        key: item.id,
                    }
                })
            })
        })
        return treeData
    }

    const convertPermissionTree = () => {
        if (permissions && visible) {
            return <Tree checkable defaultExpandAll={true} showIcon={true} selectable={false}
                         defaultCheckedKeys={renderDefaultCheckedKeys()} treeData={convertTreeData()}
                         onCheck={onCheck}/>
        }
    }

    return <Drawer {...props} title={role?.name} placement={"right"} onClose={onCancel} extra={renderExtra()}>
        {
            convertPermissionTree()
        }
    </Drawer>
}

export default PermissionDrawer;