package entity

import "github.com/thetasensors/theta-cloud-lite/server/domain/po"

type Network struct {
	po.Network
}

func (n *Network) RemoveDevice(e Device) {
	if len(n.RoutingTables) == 0 {
		return
	}
	parent := po.RoutingTable{}
	rmIdx := 0
	for i, table := range n.RoutingTables {
		if table[0] == e.MacAddress {
			parent = table
			rmIdx = i
		}
	}
	for i, table := range n.RoutingTables {
		if table[1] == e.MacAddress {
			n.RoutingTables[i][1] = parent[1]
		}
	}
	n.RoutingTables = append(n.RoutingTables[0:rmIdx], n.RoutingTables[rmIdx+1:]...)
}

func (n *Network) AccessDevices(parent Device, children []Device) {
	tables := make(po.RoutingTables, len(children))
	for i, child := range children {
		tables[i] = po.RoutingTable{
			child.MacAddress,
			parent.MacAddress,
		}
	}
	n.RoutingTables = append(n.RoutingTables, tables...)
}

func (n *Network) ReplaceDevice(e Device, newMac string) {
	for i, table := range n.RoutingTables {
		if table[0] == e.MacAddress {
			n.RoutingTables[i][0] = newMac
		}
		if table[1] == e.MacAddress {
			n.RoutingTables[i][1] = newMac
		}
	}
}

type Networks []Network
