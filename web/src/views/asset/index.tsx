import {FC, useCallback, useEffect, useState} from "react";
import {Button, Card, List, Skeleton} from "antd";
import {Content} from "antd/lib/layout/layout";
import {GetAssetRequest, PagingAssetsRequest, RemoveAssetRequest} from "../../apis/asset";
import {Asset} from "../../types/asset";
import {DeleteOutlined, EditOutlined, MonitorOutlined, PlusOutlined} from "@ant-design/icons";
import ShadowCard from "../../components/shadowCard";
import MyBreadcrumb from "../../components/myBreadcrumb";
import InfiniteScroll from "react-infinite-scroll-component";
import AssetEditModal from "./assetEditModal";


const AssetPage: FC = () => {
    const [editVisible, setEditVisible] = useState(false);
    const [asset, setAsset] = useState<Asset>()
    const [refreshKey, setRefreshKey] = useState<number>(0)
    const [records, setRecords] = useState<Asset[]>([])
    const [total, setTotal] = useState<number>(0)
    const [current, setCurrent] = useState<number>(1)

    const fetchAssets = useCallback((current: number, size: number) => {
        PagingAssetsRequest(current, size).then(data => {
            const ids = records.map(item => item.id)
            setRecords([...records, ...data.result.filter(item => !ids.includes(item.id))])
            setTotal(data.total)
            setCurrent(data.page)
        })
    }, [refreshKey])

    useEffect(() => {
        fetchAssets(1, 10)
    }, [fetchAssets])

    const onRefresh = () => {
        setRefreshKey(refreshKey + 1)
    }

    const onDelete = async (id: number) => {
        RemoveAssetRequest(id).then()
    }

    const onEdit = async (id: number) => {
        GetAssetRequest(id).then(data => {
            setAsset(data)
            setEditVisible(true)
        })
    }

    const renderActions = (id: number) => {
        return [
            <Button type={"text"} icon={<MonitorOutlined/>} onClick={() => {
                window.location.hash = "asset-management?locale=assetMonitor&id=" + id
            }}/>,
            <Button type={"text"} icon={<EditOutlined/>} onClick={() => onEdit(id)}/>,
            <Button type={"text"} icon={<DeleteOutlined/>} danger/>
        ]
    }

    return <Content>
        <MyBreadcrumb>
            <Button type="primary" onClick={() => {
                setEditVisible(true)
            }}>
                添加资产 <PlusOutlined/>
            </Button>
        </MyBreadcrumb>
        <ShadowCard>
            <div id="scrollableDiv"
                 style={{
                     height: "400px",
                     overflow: 'auto',
                     border: '0px solid rgba(140, 140, 140, 0.35)',
                 }}>
                <InfiniteScroll dataLength={records.length}
                                hasMore={records.length < total}
                                loader={<Skeleton paragraph={{rows: 1}} active={true}/>}
                                next={() => {
                                    fetchAssets(current + 1, 10)
                                }}>
                    <List size={"small"} dataSource={records}
                          grid={{column: 4}}
                          renderItem={asset => {
                              return <List.Item key={asset.id}>
                                  <ShadowCard
                                      cover={<img alt={asset.name} height={144} style={{objectFit: "cover"}}
                                                  src={`/api/resources/assets/${asset.image}`}/>}
                                      actions={renderActions(asset.id)}
                                  >
                                      <Card.Meta title={asset.name}/>
                                  </ShadowCard>
                              </List.Item>
                          }}
                    />
                </InfiniteScroll>
            </div>
        </ShadowCard>
        {
            asset && <AssetEditModal asset={asset} visible={!!asset}
                                     onCancel={() => setAsset(undefined)}
                                     onSuccess={() => {
                                         setAsset(undefined)
                                         onRefresh()
                                     }}
            />
        }
    </Content>
}

export default AssetPage