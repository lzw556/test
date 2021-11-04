import {Canvas, Edge, EdgeProps, Label, MarkerArrow, Node, NodeProps, Remove} from "reaflow";
import "./graph.css"
import {FC, useEffect, useState} from "react";
import {Device} from "../../../types/device";
import {DeviceType} from "../../../types/device_type";
import {Network} from "../../../types/network";
import {ColorHealth, ColorWarn} from "../../../constants/color";
import {Popover} from "antd";
import "../../../string-extension"
import DeviceInfoPopover from "./deviceInfoPopover";
import useSocket from "../../../socket";

interface INode {
    id: string
    text: string
    data: {
        device: Device
    }
}

interface IEdge {
    id: string
    from: string
    to: string
}

export interface GraphProps {
    network: Network
    onNodeRemove?: (id: number, routingTables:any) => void
    isEdit: boolean
    height: number
}

const Graph: FC<GraphProps> = ({network, onNodeRemove, isEdit, height}) => {
    const [data, setData] = useState<{ nodes: INode[], edges: IEdge[] }>()
    const [selections, setSelections] = useState<string[]>([])
    const {connectionState} = useSocket()

    useEffect(() => {
        const nodes = network.nodes.map(item => {
            if (connectionState && connectionState.id === item.id) {
                item.status.isOnline = connectionState.isOnline
            }
            return {id: item.macAddress, text: item.name, data: {device: item}}
        })
        const edges = network.routingTables.map(item => {
            return {from: item[1], to: item[0], id: item[0]}
        })
        setSelections(isEdit ? nodes.filter(item => item.data.device.typeId !== DeviceType.Gateway).map(item => item.id) : [])
        setData({nodes: nodes, edges: edges})
    }, [network, connectionState, isEdit])

    const onRemove = (node: any) => {
        if (data) {
            const newNodes = data.nodes.filter((n: any) => n.id !== node.id)
            const newEdges = data.edges.filter((e: any) => e.from !== node.id && e.to !== node.id)
            const parents = data.edges.filter((e: any) => e.to === node.id)
            const children = data.edges.filter((e: any) => e.from === node.id)
            parents.forEach((parent: any) => {
                children.forEach((child: any) => {
                    const parentNode = data.nodes.find((n: any) => n.id === parent.from)
                    const childNode = data.nodes.find((n: any) => n.id === child.to)
                    if (parentNode && childNode) {
                        newEdges.push({id: childNode.id, from: parentNode.id, to: childNode.id})
                    }
                })
            })
            if (onNodeRemove) {
                onNodeRemove(node.data.device.id, newEdges.map(item => [item.to, item.from]))
            }
            setData({nodes: newNodes, edges: newEdges})
        }
    }

    const renderNode = (props: NodeProps) => {
        const isOnline = props.properties.data.device.status.isOnline
        let color = ColorWarn
        if (isOnline) {
            color = ColorHealth
        }
        return <Node
            style={{fill: "rgba(255, 255, 255, 0)", strokeWidth: 1, stroke: color}}
            label={<Label style={{fill: "rgba(255, 255, 255, 0)"}} text={""} width={0} height={0}/>}
            onRemove={(event, node) => {
                onRemove(node)
            }}
        >
            {
                event => (
                    <foreignObject height={event.height} width={event.width} x={0} y={0}>
                        <Popover placement={"bottom"} content={<DeviceInfoPopover device={event.node.data.device}/>}
                                 title={event.node.text}>
                            <div style={{textAlign: "center", position: "fixed", bottom: 0, top: 0, left: 0, right: 0}}>
                                <a href={`#/device-management/devices?locale=deviceDetail&id=${event.node.data.device.id}`}
                                   style={{color: color}}>{event.node.text}</a>
                            </div>
                        </Popover>
                    </foreignObject>
                )
            }
        </Node>
    }

    const renderEdge = (edge: EdgeProps) => {
        return <Edge remove={<Remove hidden={true}/>}/>
    }

    return <div className="ts-graph" style={{height: `${height - 56}px`}}>
        <Canvas pannable={true}
                arrow={<MarkerArrow style={{fill: "#8a8e99"}}/>}
                fit={true}
                selections={selections} nodes={data?.nodes} edges={data?.edges}
                edge={renderEdge}
                node={renderNode}
        />
    </div>
}

export default Graph