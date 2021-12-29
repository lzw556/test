package repository

import (
	"bytes"
	"github.com/thetasensors/theta-cloud-lite/server/domain/entity"
	"github.com/thetasensors/theta-cloud-lite/server/pkg/json"
	"go.etcd.io/bbolt"
	"time"
)

type SensorData struct {
	repository
}

func (repo SensorData) Create(e entity.SensorData) error {
	return repo.BoltDB().Update(func(tx *bbolt.Tx) error {
		bucket, err := tx.CreateBucketIfNotExists([]byte(e.BucketName()))
		if err != nil {
			return err
		}
		dataBucket, err := bucket.CreateBucketIfNotExists([]byte(e.MacAddress))
		if err != nil {
			return err
		}
		buf, err := json.Marshal(e)
		if err != nil {
			return err
		}
		return dataBucket.Put([]byte(e.Time.UTC().Format("2006-01-02T15:04:05Z")), buf)
	})
}

func (repo SensorData) Find(mac string, from, to time.Time) ([]entity.SensorData, error) {
	var es []entity.SensorData
	err := repo.BoltDB().View(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(entity.SensorData{}.BucketName()))
		if bucket != nil {
			if dataBucket := bucket.Bucket([]byte(mac)); dataBucket != nil {
				c := dataBucket.Cursor()
				min := []byte(from.UTC().Format("2006-01-02T15:04:05Z"))
				max := []byte(to.UTC().Format("2006-01-02T15:04:05Z"))
				for k, v := c.Seek(min); k != nil && bytes.Compare(k, max) <= 0; k, v = c.Next() {
					var e entity.SensorData
					if err := json.Unmarshal(v, &e); err != nil {
						return err
					}
					es = append(es, e)
				}
			}
		}
		return nil
	})
	return es, err
}

func (repo SensorData) Get(mac string, time time.Time) (entity.SensorData, error) {
	var e entity.SensorData
	err := repo.BoltDB().View(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(entity.SensorData{}.BucketName()))
		if bucket != nil {
			if dataBucket := bucket.Bucket([]byte(mac)); dataBucket != nil {
				c := dataBucket.Cursor()
				current := []byte(time.UTC().Format("2006-01-02T15:04:05Z"))
				var buf []byte
				if k, v := c.Seek(current); k != nil {
					buf = v
				} else if bytes.Compare(k, current) <= 0 {
					_, buf = c.Next()
				}
				if err := json.Unmarshal(buf, &e); err != nil {
					return err
				}
			}
		}
		return nil
	})
	return e, err
}

func (repo SensorData) Top(mac string, limit int) ([]entity.SensorData, error) {
	var es []entity.SensorData
	err := repo.BoltDB().View(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(entity.SensorData{}.BucketName()))
		if bucket != nil {
			if dataBucket := bucket.Bucket([]byte(mac)); dataBucket != nil {
				c := dataBucket.Cursor()
				for k, v := c.Last(); k != nil && len(es) < limit; k, v = c.Prev() {
					var e entity.SensorData
					if err := json.Unmarshal(v, &e); err != nil {
						return err
					}
					es = append(es, e)
				}
			}
		}
		return nil
	})
	return es, err
}

func (repo SensorData) Last(mac string) (entity.SensorData, error) {
	var e entity.SensorData
	err := repo.BoltDB().View(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(e.BucketName()))
		if bucket != nil {
			if dataBucket := bucket.Bucket([]byte(mac)); dataBucket != nil {
				c := dataBucket.Cursor()
				_, v := c.Last()
				if len(v) > 0 {
					if err := json.Unmarshal(v, &e); err != nil {
						return err
					}
				}
			}
		}
		return nil
	})
	return e, err
}

func (repo SensorData) Delete(mac string, from, to time.Time) error {
	err := repo.BoltDB().Update(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(entity.SensorData{}.BucketName()))
		if bucket != nil {
			if dataBucket := bucket.Bucket([]byte(mac)); dataBucket != nil {
				c := dataBucket.Cursor()
				min := []byte(from.UTC().Format("2006-01-02T15:04:05Z"))
				max := []byte(to.UTC().Format("2006-01-02T15:04:05Z"))
				for k, _ := c.Seek(min); k != nil && bytes.Compare(k, max) <= 0; k, _ = c.Next() {
					if err := dataBucket.Delete(k); err != nil {
						return err
					}
				}
			}
		}
		return nil
	})
	return err
}
